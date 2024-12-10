---
title: "Async pipe w Angular - szczegółowa analiza"
date: "2020-03-10"
categories: 
  - "angular"
tags: 
  - "angular"
  - "async"
  - "design-patterns"
  - "javascript"
  - "pipe"
  - "typescript"
  - "wzorce-projektowe"
author:
   name: Marek Szkudelski
   picture: '/assets/blog/authors/face.png'
ogImage:
 url: ''
level: "Średniozaawansowany"
description: 'Robię analizę async pipe w Angular, a więc przechodzę przez kod źródłowy, który jest odpowiedzialny za jego implementację. Pokazuję wzorce, które zostały tam użyte i sprawdzam jak działa on pod podszewką.'
---

Pewnie wiele razy używałeś async pipe’a we frameworku Angular, a jeśli nie to w następnej sekcji jest krótkie wprowadzenie dla Ciebie. Bardziej doświadczeni mogę je ominąć. W tym artykule chciałbym zrobić analizę async pipe w Angular, a więc przejść przez kod źródłowy, który jest odpowiedzialny za jego implementację. Chcę pokazać Ci wzorce, które zostały tam użyte i sprawdzić jak działa on pod podszewką.

### **Wprowadzenie do Async Pipe**

async to wbudowany pipe, który znajdziemy w module @angular/common. Jak można przeczytać w oficjalnej dokumentacji Angulara: 

> _“Unwraps a value from an asynchronous primitive.”_

Asynchronous primitive to może być instancja **Promise** albo **Observable**. Jeśli masz jakiś strumień danych w komponencie, na przykład Observable’a, to musisz najpierw zasubskrybować się do niego, a potem, gdy dostaniesz już wartość, przypisać ją do właściwości komponentu. Dopiero wtedy możesz użyć tej wartości w szablonie. AsyncPipe robi to wszystko za Ciebie. Dzięki niemu możesz Observable’a użyć bezpośrednio w template, tak jak w kodzie poniżej, gdzie userName$ jest instancją Observable’a:

```markup
<ng-container *ngIf="(userName$ | async) as userName">
  {{ userName }}
</ng-container>
```

Ponadto kiedy używasz AsyncPipe’a nie musisz pamiętać, żeby się od niego odsubskrybować (co zapobiega wyciekom pamięci). Możesz też stworzyć alias do wartości przekazanej przez Observable’a i użyć go kilka razy w szablonie.

### **Trochę o reverse-engineering (inżynieria wsteczna)**

Wydaję mi się, że nie każdy kto programuje w Angularze wie co się dzieje wewnątrz AsyncPipe’a. Myślę, że nawet można założyć, że mało kto wie. Możesz sobie zadawać pytania w stylu: “To działa, jest świetne, więc po co mam wiedzieć co jest w jego kodzie źródłowym?” albo “Czy to jest takie ważne, żebym wiedział?”. Oczywiście znajomość i zrozumienie kodu AsyncPipe’a nie sprawi, że będziesz lepiej z niego korzystał. Może natomiast znacznie podnieść Twoje kompetencje programistyczne i zwiększyć Twoją wiedzę.

Zagłębianie się w kod napisany przez kogoś innego jest znane jako reverse-engineering, czyli inżynieria wsteczna. Jest to proces czytania i analizy kodu, które mają na celu zrozumienie w jaki sposób on działa. Więcej na ten temat możesz przeczytać w świetnych artykule Max’a Koretskyi’ego: [Level up your reverse-engineering skills](https://indepth.dev/level-up-your-reverse-engineering-skills/).

## **Analiza Async Pipe**

Cała analiza, którą poniżej przedstawię jest na podstawie kodu Angulara, który znajduje się [tutaj](https://github.com/angular/angular/blob/9.0.6/packages/common/src/pipes/async_pipe.ts). Jeśli czytasz ten artykuł w bardziej odległej przyszłości, to omawiam tutaj kod z aktualnie najnowszej, stabilnej wersji, czyli 9.0. Może się on nieznacznie różnić od przyszłych wersji. Będziemy dość szczegółowo zagłębiać się w kod, więc fajnie jakbyś miał możliwość równolegle, na przykład w zakładce obok, otworzyć kod źródłowy. Możemy tam znaleźć klasę **AsyncPipe,** inne klasy ściśle powiązane z nią oraz trochę dokumentacji w komentarzach. Cały plik nie ma więcej niż 150 linijek kodu.

### **Strategy pattern (wzorzec strategii)**

W pierwszej połowie pliku mamy interface **‘SubscriptionStrategy’** i dwie klasy: **‘ObservableStrategy’** oraz **‘PromiseStrategy’**. Te dwie klasy implementują interface **‘SubscriptionStrategy’**. Bazując na tych trzech deklaracjach oraz nazewnictwie, które tutaj widzimy można wywnioskować, że mamy do czynienia z wzorcem strategii.

```typescript
interface SubscriptionStrategy {
  createSubscription(
    async: Observable<any>|Promise<any>,
    updateLatestValue: any
  ): SubscriptionLike|Promise<any>;
  dispose(subscription: SubscriptionLike|Promise<any>): void;
  onDestroy(subscription: SubscriptionLike|Promise<any>): void;
}

class ObservableStrategy implements SubscriptionStrategy {
  ...
}

class PromiseStrategy implements SubscriptionStrategy {
  ...
}
```

Wzorzec strategii jest wykorzystywany w sytuacjach kiedy mamy jakąś logikę w klasie, która może być wymienna z inną logiką. Zazwyczaj jest zależna od argumentu przekazanego do konstruktora, ale instancja klasy implementującej strategię może też być tym argumentem. W tym wzorcu deklarujemy abstrakcyjny interface zawierający metody, które konkretna klasa musi zaimplementować. W miejscach gdzie spodziewamy się, że będzie użyta strategia (może to być na przykład właściwość klasy) używamy tego abstrakcyjnego interface’u do typowania, ponieważ nie wiemy jeszcze jaka strategia będzie użyta. Dobrym przykładem może być klasa Pracownik. Każdy pracownik może mieć podpisaną inną umowę: umowa zlecenie, o pracę, kontrakt B2B. Aby obliczyć wynagrodzenie netto potrzebujemy różnej logiki. I tu właśnie możemy użyć wzorca strategii, żeby przekazać klasie Pracownik jak ma być liczone jego wynagrodzenie. 

> Więcej o wzorcu strategii napisałem w tym [artykule](https://blog.szkudelski.dev/posts/wzorzec-strategii-na-realnym-przykladzie/). Znajdziesz tam również praktyczne zastosowanie w Typescripcie.

Poniżej przygotowałem dla was diagram UML. Jest bardzo uproszczony, bo nie zawiera wszystkich metod albo właściwości. Jest tak dlatego, że mam na celu zwizualizowanie jak wzorzec strategii jest zaimplementowany w AsyncPipe. Jak napisałem wyżej są dwie klasy implementujące interface **SubscriptionStrategy,** który jest abstrakcją. Oznacza to, że te klasy muszą mieć zaimplementowane wszystkie metody, które są zadeklarowane w tym interface. Jest on wykorzystywany w konkretnym kontekście, czyli w klasie **AsyncPipe,** jako prywatne pole **‘strategy**’.

![Diagram pokazujący użycie wzorca strategii w async pipe ](https://lh5.googleusercontent.com/o4ofyfIE3ap1uzZbqsZ61oPVH09d1eQMNp2xV9t8QITEA9lEZtfXqFSJAkNHmNrduxxzDoga73BAH5WSau7H1Z_WzjsJCTtG6sOfhAZl6UkBYVK3y_tQHbOsSVO9WAiPCp9yg8kX)

Diagram pokazujący użycie wzorca strategii w async pipe

A więc, jakie są odpowiedzialności tych strategii? Implementują one trzy metody, z których pierwsza, najbardziej złożona, ustawia nasłuchiwanie na nowe wartości emitowane przez asynchroniczny obiekt. Przyjmuje dwa argumenty. Pierwszy to **‘async**’ i jest to instancja **Observable**, albo **Promise** (w zależności od strategii)**.** Drugi argument to callback, czyli funkcja, która będzie wywołana jeśli **async** wyemituje jakąś wartość, albo, jeśli jest to **Promise**, to wtedy gdy będzie on resolved. Ponadto, jeśli **async** rzuci jakiś błąd, to zostanie on przechwycony i puszczony dalej.

Kolejne dwie metody zostały zaimplementowane tylko w klasie **ObservableStrategy.**  Funkcje ‘**dispose**’ oraz ‘**onDestroy**’ są używane, żeby odsubskrybować się od **Observable**’a, co ma na celu uniknięcie wycieków pamięci. Są one niepotrzebne jeśli chodzi o **Promise**’y, ponieważ **Promise** może być resolved tylko raz, więc nie ma ryzyka żadnych wycieków.

Według pierwszej z zasad **SOLID** (czyli Single Responsibility Principle) każda klasa powinna mieć tylko jedną odpowiedzialność. Jeśli jesteśmy w stanie wyrazić tą odpowiedzialność w jednym zdaniu, to znaczy, że _najprawdopodobniej_ dobrze zastosowaliśmy się do tej zasady. Myślę, że w przypadku tych klas strategii taka odpowiedzialność mogłaby zawrzeć się w następującym zdaniu: “Obsługa subskrybcji do asynchronicznego obiektu przekazanego klasie **AsyncPipe**”. 

### **Przejście przez klasę Async Pipe** 

Przejdźmy w końcu do samej klasy **AsyncPipe.** Jak możesz zobaczyć w [kodzie źródłowym](https://github.com/angular/angular/blob/9.0.5/packages/common/src/pipes/async_pipe.ts), klasa ma bardzo prostą strukturę: jedna metoda publiczna, jeden argument konstruktora. Tym argumentem jest [ChangeDetectorRef](https://angular.io/api/core/ChangeDetectorRef), więc możemy się spodziewać, że będzie zachodzić jakaś manipulacja mechanizmem Change Detection. Jeśli chodzi o metodę publiczną to jest to ‘**transform**’. Jest to generyczna, przeciążona funkcja z wieloma deklaracjami. Oznacza to, że może ona zwrócić różne wartości w zależności od tego jakie parametry (i jakich typów) dostała.

```typescript
transform<T>(obj: null): null;
transform<T>(obj: undefined): undefined;
transform<T>(obj: Observable<T>|null|undefined): T|null;
transform<T>(obj: Promise<T>|null|undefined): T|null;
transform(obj: Observable<any>|Promise<any>|null|undefined): any;
```

Patrząc na ciało tej funkcji widać, że trzeba rozważyć 4 przypadki, ponieważ mamy 3 wyrażenia warunkowe, a po nich jest jeszcze kawałek kodu (czyli przypadek, że żaden warunek nie będzie spełniony). Zauważ, że są to przypadki wykluczające się, czyli żaden nie zajdzie, gdy zachodzi inny, ponieważ w każdym bloku kodu jest instrukcja **return,** która kończy wykonywanie funkcji. W kolejnych sekcjach przejdziemy przez te 4 przypadki i zastanowimy się jak **async** reaguje w różnych sytuacjach.

#### **Przypadek 1: Inicjacja**

Mamy tutaj sytuację kiedy właściwość **obj,** która odpowiada za przechowywanie asynchronicznego obiektu, nie ma jeszcze żadnej wartości (ma przypisany **null**), czyli jest to pierwsze wywołanie metody, albo wcześniej był przekazywany do niej **null**.  Jeśli został przekazany parametr **obj**, który jest (a raczej powinien być) asynchronicznym obiektem, to jest wywoływana metoda **subscribe**, która ustala jaki jest to obiekt, wybiera odpowiednią strategię i subskrybuje się do niego. Później jest zwracana z metody **transform** ostatnia wartość (**latestValue**), czyli w tym przypadku **null.**

#### **Przypadek 2: Zmiana**

Drugi warunek zachodzi, kiedy został przekazany parametr, który różni się od **obj.** Zatem zaszła tutaj sytuacja kiedy na przykład w komponencie przypisaliśmy do właściwości inny Observable niż był wcześniej. W takim przypadku **AsyncPipe** “czyści się” przez metodę **dispose**. Zachodzi tutaj przypisanie **null**’i do właściwości klasy oraz odsubskrybowanie się od poprzedniego asynchronicznego obiektu za pośrednictwem strategii. Następnie metoda **transform** wywołuje samą siebie z takim samym parametrem, ale teraz instancja jest już wyczyszczona, więc wpadamy w pierwszy warunek (sekcja **Przypadek 1: Inicjacja**). 

#### **Przypadek 3: Stagnacja**

Chyba najprostszy do omówienia przypadek. Jeśli zachodzi warunek - ostatnia zwracana wartość (**latestReturnedValue**) jest równa najnowszej wartości (**latestValue**), to zwróć ostatnią zwracaną wartość. Ten przypadek został rozpatrzony na wypadek jeśli zostałby odpalony mechanizm Change Detection na danym komponencie, a wartość nie zmieniła się. Wtedy pipe musi zwrócić tą samą wartość co poprzednio, żeby została wyrenderowana.

#### **Przypadek 4: Aktualizacja**

Tutaj z kolei mamy przypadek, kiedy nie zaszły pierwsze dwa warunki, a ponadto zmieniła się wartość uzyskana z asynchronicznego obiektu. Pojawia się tutaj coś bardzo ciekawego, czyli wywołanie metody **WrappedValue.wrap**, która zwraca nam instancję klasy **WrappedValue**. Zgodnie z dokumentacją [angular.io](https://angular.io/api/core/WrappedValue):

> Indicates that the result of a [Pipe](https://angular.io/api/core/Pipe) transformation has changed even though the reference has not changed.

Oznacza to tyle, że przekonujemy mechanizm Change Detection, że wartość zwrócona przez pipe zmieniła się pomimo tego, że nie została zmieniona referencja do obiektu przekazanego do tego pipe’a. 

Tutaj chyba warto wspomnieć kilka słów o tym jak działa Change Detection w Angular. Ten mechanizm może być odpalony w różny sposób w zależności od strategii. Domyślnie reaguje on na różnego rodzaju zdarzenia odpalone przez użytkownika (takie jak kliknięcie, albo ruch myszką), wychodzące zapytania na serwer albo wywołania funkcji setTimeout lub setInterval. Change Detection przechodzi przez całe drzewo komponentów aplikacji i sprawdza czy któryś się zmienił i trzeba go wyrenderować na nowo. Sprawdza wartości, a w przypadku obiektów, czy tablic - referencje. 

Jeśli przekazaliśmy do pipe’a obiekt i nie zmieniliśmy jego referencji, to Change Detection będzie “myślał”, że nic się nie zmieniło. I dlatego właśnie potrzebujemy **WrappedValue.**

Pozostaje odpowiedzieć tak naprawdę na ostatnie pytanie: skąd **AsyncPipe** bierze nowe wartości? Callback przekazany do obiektu strategii wywołuje metodę **updateLatestValue**, która aktualizuje właściwość **latestValue** oraz oznacza referencję do Change Detector’a jako “do sprawdzenia”. ChangeDetectorRef jest to referencja do View komponentu, w którym jest użyty pipe. Dzięki niemu możemy manipulować drzewem komponentów w kontekście Change Detection. W tej sytuacji dajemy znać mechanizmowi Change Detection, że musi sprawdzić czy zaszły zmiany, nawet jeśli nie nastąpiło żadne zdarzenie, które wywołało ten mechanizm.

### **Co bym zrobił lepiej**

Tytuł tej sekcji brzmi co najmniej kontrowersyjnie, ponieważ sugeruje, że będę krytykował kogoś kto napisał ten kod. Ale uważam, że krytyka nie ma w sobie nic złego dopóki jest konstruktywna i ktoś może wyciągnąć z niej jakąś wartość. Myślę, że nie ma osób, które piszą kod idealny i w każdym kodzie można coś poprawić albo napisać w inny sposób. Więc poniżej podzielę się _swoimi_ _opiniami_, ale jeśli macie inne zdanie na te tematy, to dajcie znać w komentarzu.

Po pierwsze, jestem przeciwnikiem używania typu **any**. Spójrz na fragment kodu poniżej. Jeśli zamienimy **any** na typ generyczny, to w każdym miejscu gdzie mamy literkę **T** musi być ten sam typ co w innych miejscach. W przypadku **any** w każdym z tych miejsc mógłby być jakikolwiek typ.  Na przykład, do **latestValue** moglibyśmy przypisać **string**, kiedy **lastestReturnedValue** mógłby mieć przypisany **number**. W przypadku typu generycznego Typescript nie pozwala nam na to. Oczywiście są sytuacje kiedy można użyć **any**, a nawet powinno się, ale to nie jest ten przypadek.

```typescript
export class AsyncPipe<T> implements OnDestroy, PipeTransform {
  private _latestValue: T = null;
  private _latestReturnedValue: T = null;

  private _subscription: SubscriptionLike|Promise<T>|null = null;
  private _obj: Observable<T>|Promise<T>|EventEmitter<T>|null = null;
  private _strategy: SubscriptionStrategy = null !;
}
```

Druga rzecz, która rzuca się w oczy to niespójność w typowaniu. Mamy klasy strategii do **Observables**, do **Promises**, a w momencie typowania właściwości **obj** pojawia się **EventEmitter** (???). Natomiast parametr **obj** już takiego typu nie ma. Nie wiem co miał na myśli autor, ale klasa **EventEmitter** dziedziczy po klasie **Subject**, a ta z kolei rozszerza **Observable**, więc typ **EventEmitter** jest kompatybilny z **Observable**. Oznacza to, że **Observable** przy typowaniu zupełnie wystarcza.

Kolejna rzecz na którą chciałbym zwrócić Twoją uwagę, to konwencja nazewnictwa. Uważam, że dodawanie podkreślenia “\_” przed prywatnymi właściwościami klasy jest zupełnie zbędne w Typescript. Ma on słowo kluczowe **private**, które pozwala w prosty sposób je wyróżnić. Są sytuacje kiedy chcemy zrobić jakiś rodzaj enkapsulacji logiki, więc nazwa właściwości jest zajęta na przykład przez getter, ale tutaj to nie ma miejsca.

Jak już jesteśmy przy nazewnictwie, to nie jestem przekonany do skracania nazw, czy to zmiennych, właściwości, czy klas. Kiedy patrzysz pierwszy raz na taki kod i widzisz nazwę **obj,** to co myśli? To jest jakiś akronim? Może jest to obiekt? Ale jaki obiekt i do czego jest wykorzystywany? W tym konkretnym przykładzie być może lepszą nazwą byłoby “async” albo “asynchronousPrimitive”, jeśli chcielibyśmy być bardziej szczegółowi.

### **Podsumowanie**

Ok, przebrnęliśmy przez kawał kodu, więc czas podsumować czego się nauczyliśmy:

1. Jeśli nie wiedziałeś wcześniej nic o async pipe, to teraz wiesz do czego służy. Dzięki niemu możesz wyciągać wartości z asynchronicznego obiektu bezpośrednio w template komponentu.
2. Zapoznaliśmy się z wzorcem strategii. Jeśli masz jakąś logikę, która jest inna dla różnych parametrów, to najprawdopodobniej powinieneś użyć tego wzorca. 
3. Wspomnieliśmy o Zasadzie Pojedynczej Odpowiedzialności (Single Responsibility Principle). Jeśli możesz opisać odpowiedzialność swojej klasy lub funkcji w jednym zdaniu, to znaczy, że najprawdopodobniej dobrze zastosowałeś tę zasadę.
4. Dowiedzieliśmy się podstaw działania Change Detection w Angularze. Jeśli potrzebujesz manipulować tym mechanizmem, to powinieneś użyć ChangeDetectorRef. Poznaliśmy też klasę **WrappedValue,** która pomaga w manipulacji Change Detection.
5. Na koniec omówiliśmy trochę konwencje nazewnictwa. Podkreślenia przed prywatnymi właściwościami są w TSie zbędne. No i lepiej też nie skracać nazw, bo może być to mylące dla innych.

Za nami długa droga. Dzięki, że dotarłeś ze mną aż tutaj. Mam nadzieję, że artykuł Ci się podobał i nauczyłeś się czegoś wartościowego. Jeśli masz jakiekolwiek wątpliwości na temat tego co napisałem, to daj mi znać. Część tego co pisałem jest moją opinią i jeśli masz inną to bardzo chętnie ją poznam.
