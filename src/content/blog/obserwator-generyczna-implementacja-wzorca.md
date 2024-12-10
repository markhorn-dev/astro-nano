---
title: "Obserwator - generyczna implementacja wzorca"
date: "2020-07-14"
categories: 
  - "typescript"
tags: 
  - "design-patterns"
  - "javascript"
  - "observable"
  - "observer"
  - "obserwator"
  - "publish-subscribe"
  - "subscription"
  - "typescript"
  - "wzorce-projektowe"
author:
    name: Marek Szkudelski
    picture: '/assets/blog/authors/face.png'
ogImage:
  url: ''
level: "Średniozaawansowany"
description: 'Wzorzec Obserwator (Observer) znany w świecie Javascript często jako obiekt Observable. Każdy nawet początkujący spotyka się z tym wzorcem, więc w tym artykule pokazuję jak on działa i implementuję go od zera.'
---

Chciałbym poruszyć temat kolejnego wzorca projektowego z którym dość często spotykają się frontend deweloperzy. Jest to wzorzec Obserwator (Observer), ale znany w świecie Javascript często jako obiekt Observable, czyli obiekt obserwowalny. Jednak każdy nawet początkujący spotyka się z tym wzorcem, ponieważ EventListener z DOMu jest jego implementacją. W artykule pokażę jak zaimplementować swoją własną w miarę prostą klasę Observable w Typescript.

## Opis problemu

Jak w każdym artykule w którym piszę o wzorcach chciałbym na początek przedstawić jakie problemy możemy rozwiązać przez zastosowanie Obserwatora.

Wyobraźmy sobie, że mamy bardziej złożoną aplikację z systemem powiadomień podobnych do tych facebook'owych. Powiadomienia wyświetlają się w małym boxie w lewym dolnym rogu oraz wyskakuje czerwona kropka z liczbą nieprzeczytanych notyfikacji w pasku nawigacji. Są to dwie zupełnie oddzielne części aplikacji. Mając klasy, które są kontrolerami tych dwóch komponentów możemy udostępnić publiczne metody, które będziemy wyłowywać w miejscu w którym otrzymamy notyfikację. Oznacza to, że każdy z poziomu kodu będzie mógł z zewnątrz wyświelić powiadomienie w danym komponencie, ponieważ metoda jest publiczna. Raczej nie jest to porządane zachowanie, bo chcemy, żeby to kontroler i tylko kontroler decydował kiedy pokazać powiadomienie.

```typescript
class NotificationService {
  notify(notification) {
    this.navbarController.addNotify(notification);
    this.notificationController.showNotification(notification);
  }
}
```

Ponadto serwis (patrz snippet powyżej) w którym będziemy otrzymywać notyfikacje będzie musiał mieć informacje jakie metody konkretnych klas wywołać. Oznacza to wysoki coupling (inaczej powiązanie) pomiędzy serwisem, a tymi dwoma kontrolerami. Serwis musi wiedzieć jakie metody powinien wywołać, w jakich klasach i jeszcze musi mieć instancje tych klas. Oznacza to, że klasy kontrolerów oraz serwis są ściśle powiązane.

> Coupling jest miarą tego jak ściśle są powiązane ze sobą dane elementy w programowaniu np. klasy. Zazwyczaj im luźniejsze jest to powiązane tym kod jest czytelniejszy i łatwiejszy w utrzymywaniu.

## Opis wzorca Obserwator

Te dwa powyższe problemy rozwiązuje nam wzorzec Obserwator. Polega on na zdefiniowaniu obiektu, który będzie informował inne obiekty jeśli np. jego stan się zmieni albo zostanie to w inny sposób wywołane. Jak możemy przeczytać w poniższym cytacie możemy wiele Obserwatorów połączyć z takim obiektem.

> Określa zależność jeden do wielu między obiektami. Kiedy zmieni się stan jednego z obiektów, wszystkie obiekty zależne od niego są o tym automatycznie powiadamiane i aktualizowane.
> 
> Fragment książki "_**Wzorce projektowe. Elementy oprogramowania obiektowego wielokrotnego użytku**_"

Dzięki zastosowaniu tego wzorca nie będziemy musieli udostępniać żadnych publicznych metod, bo w konstruktorze (albo gdzieś indziej) będziemy mogli dodać obserwatora do obiektu, który chcemy obserwować i zareagować na zmianę jego stanu. Po drugie, serwis nie będzie musiał mieć żadnych informacji o kontrolerach. Będzie przechowywał tylko obiekt obserwowalny przez który będzie przekazywał powiadomienia.

Zauważ, że w tym przypadku też mamy do czynienia z couplingiem, ale jest on o wiele luźniejszy niż wcześniej. Serwis nie będzie musiał mieć żadnych informacji o kontrolerach, a dodanie kolejnego obserwatora nie będzie ingerowało w jego kod.

W Javascript mamy możliwość, żeby przekazać funkcję do innej funkcji, która ją wywoła (tzw. callback). Dlatego implementacja wzorca Obserwator zazwyczaj sprowadza się do przekazania funkcji, która jest obserwatorem i wywołanie wszystkich funkcji, które zostały przekazane do obiektu obserwowalnego.

## Implementacja Obserwatora

Przechodząc do implementacji zacznijmy od przykładowego dodania obserwatora, żeby wiedzieć czego będziemy potrzebowali w klasie Observable.

```typescript
class NavigationController {
  constructor(private notificationService: NotificationService) {
    this.notificationService.notification
      .subscribe((notification) => {
        // add notification to list 
      });
  }
}
```

Dodanie obserwatora jest to nic innego jak wywołanie funkcji do której przekazujemy callback. Nazywa się ona **subscribe**, ponieważ ten wzorzec czasami jest nazywany publish-subscribe, a my chcemy właśnie zasubskrybować się do kolejnych publikowanych wartości.

Spójrzmy teraz w jaki sposób będzie wyglądała publikacja nowego powiadomienia z poziomy serwisu.

```typescript
class NotificationService {
  readonly notification: Observable = new Observable();
  
  notify(notification) {
    this.notification.publish(notification);
  }
}
```

Tutaj z kolei mam wywołanie metody **publish**, która odpowiada za dostarczenie nowej wartości do obserwatorów. Wydaję mi się, że nie ma tu dużo więcej do analizowania, więc przejdźmy do implementacji klasy Observable.

> Zwróć uwagę na użycie modyfikatora **readonly** dla właściwości **notification**. Dzięki temu możemy pozostawić ją jako publiczną i jednocześnie nie obawiać się, że ktoś podmieni jej wartość na coś innego.

Wiemy już co potrzebujemy do stworzenia klasy Observable i są to dwie metody publiczne: **subscribe** oraz **publish**. Będziemy też potrzebowali prywatną tablicę obserwatorów.

```typescript
class Observable {
  private observers: Function[] = [];

  subscribe(observer: Function) {
    this.observers.push(observer);
  }

  publish(item) {
    this.observers.forEach(observer =>
      observer(item)
    );
  }
}
```

Tak jak koncepcyjnie wzorzec jest w miarę prosty tak jego podstawowa implementacja jest również nie skomplikowana. Mamy tablicę obserwatorów, która jest na początku pusta. W metodzie **subscribe** dodajemy obserwator, a w metodzie **publish** iterujemy się po liście obserwatorów i wywołujemy je z przekazanym obiektem.

## Rozszerzenie implementacji

Zauważ, że nie otypowałem parametru **item** i zrobiłem to intencjonalnie. W tej chwili to mogłoby być cokolwiek, ponieważ _implicite_ jest przekazany typ **any**. Jeśli obserwator subskrybuje się do Observable'a, to raczej będzie oczekiwał, że za każdym razem dostanie wartość tego samego typu. Oznacza to, że musimy trochę zmodyfikować nasz kod przez wprowadzenie typu generycznego.

```typescript
export class Observable<T> {
  private observers: ((item: T) => void)[] = [];

  subscribe(observer: (item: T) => void);
  publish(item: T);
}
```

Zmieniłem tylko typy, więc implementacja metod się nie zmieniła. Typ **T** może być również czymkolwiek, ale teraz już wymuszamy na użytkowniku naszej klasy, żeby podczas inicjalizacji podał typ, który będzie przekazywany przez **Observable**. Równocześnie wymuszamy na obserwatorach, żeby oczekiwali wartości o typie jaki ma **Observable**, czyli **T**.

```typescript
const observable = new Observable<number>();
observable.subscribe((data: string) => {}); // error
observable.publish('asd'); // error
```

Spójrz na powyższy kod. Typescript podczas transpilacji kodu wyrzuci błąd zarówno w trzeciej jak i czwartej linijce, ponieważ argument obserwatora i publikowana wartość muszą zgadzać się z typem Observable'a.

### Asychroniczny obserwator

Kolejną rzeczą, którą powinniśmy rozważyć jest asynchroniczność. Wyobraź sobie, że zasubskrybuje się do nas jakiś obserwator, który wymaga dużo czasu procesora by się wykonać. Będzie on blokował główny wątek aplikacji uniemożliwiając użytkownikowi interakcję. Asychroniczność można zrealizować w prosty sposób otaczając obserwator wywołaniem **setTimeout**.

```typescript
export class Observable<T> {
  ...
  publish(item: T) {
    this.observers.forEach(observer =>
      setTimeout(() => observer(item))
    );
  }
} 
```

Zamiast wywoływać obserwator bezpośrednio robię to za pomocą **setTimeout'a** bez drugiego parametru, którym jest opcjonalny **timeout** - domyślnie wynosi 0 milisekund. Co to właściwie zmienia? **setTimeout** dodaje swój callback jako następne zadanie do wykonania przez wątek aplikacji. Zamiast wykonać wszystkich obserwatorów od razu, to dodajemy ich do kolejki. Gdy aktualnie wykonywane zadanie skończy się i w między czasie nie zajdzie żadne zdarzenie do obsłużenia (np. kliknięcie) wtedy zaczną się wykonywać funkcje obserwatorów. Aby dowiedzieć się jak duże ma to znaczenie wejdź w [ten link](https://stackblitz.com/edit/ts-observable), przełącz się na branch **async-example** i odpal przeglądarkową konsolę. Zobaczysz, że bez **setTimeout'a** obserwator blokuje całą aplikację na dobre kilka sekund. Oczywiście jest to skrajny przypadek i dotyczy on operacji, które wymagają bardzo dużo czasu operacyjnego.

### Zakończenie subskrybcji obserwatora

Ostatnią rzeczą, którą uważam za minimum w tej klasie to możliwość zatrzymania obserwowania danego obiektu. W tym celu będziemy musieli jakoś rozróżniać naszych obserwatorów oraz udostępnić im możliwość odsubskrybowania się. Po pierwsze, zamieńmy tablicę na instancję Map, żeby w łatwy sposób manipulować konkretnymi obserwatorami.

[Map](https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Obiekty/Map) jest to prosta struktura, która przechowuje pary klucz-wartość, gdzie klucz musi być unikatowy w kolekcji. Jest bardzo przydatna jeśli chcemy mieć łatwy dostęp do pojedyńczych elementów z kolekcji na przykład, żeby je usunąć bądź zedytować. W przypadku dużej ilości elementów jest dużo bardziej wydajna niż tablica.

W strukturze jaką jest Map potrzebujemy unikatowy klucz. Takim kluczem może być na przykład instancja klasy. Za każdym razem jak tworzymy kolejną instancję to mamy nową referencję do tej instancji, więc klucz jest unikatowy, Oczywiście moglibyśmy użyć referencji do funkcji obserwatora, albo jakiś losowy numer lub string. Jednak chcę też ułatwić usuwanie subskrybcji, więc wprowadzam klasę **Subscription** z metodą **unsubscribe** oraz referencją do **Observable'a**.

```typescript
export class Subscription<T> {
  constructor(private observable: Observable<T>) {}

  unsubscribe() {
    this.observable.unsubscribe(this);
  }
}
```

Natomiast klasę **Observable** musimy zmodyfikować w następujący sposób:

```typescript
export class Observable<T> {
  private observers: Map<
    Subscription<T>, (item: T) => void
  > = new Map();

  subscribe(
    observer: (item: T) => void,
  ): Subscription<T> {
    const subscription = new Subscription(this);
    this.observers.set(subscription, observer);
    return subscription;
  }

  unsubscribe(subscription: Subscription<T>) {
    this.observers.delete(subscription);
  }
}
```

Podsumujmy co wydarzyło się w powyżym kodzie, bo doszło kilka zmian, które mogą wprawadzić w zakłopotanie. Po pierwsze, **observers** są teraz instancją Map'y, gdzie kluczem są subskrybcje, a wartościami funkcje obserwatorów. Podczas wykonywania metody **subscribe** dodajemy obserwator do tej Map'y, a jako klucz przekazujemy instancję subskrybcji. Do tej instancji przekazujemy referencję do **Observable'a**, która kryje się pod słowem kluczowym **this**. Ostatnia metoda służy do usuwania obserwatora z listy **observers**.

Zobaczmy teraz jak może wyglądać usunięcie subskrybcji. Mamy na to dwa sposoby. Możemy przekazać subskrybcję bezpośrednio do Observable'a, albo użyć subskrybcji i zrobić to w pośredni sposób. Osobiście uważam, że drugi sposób jest bardziej intuicyjny i prostszy w użyciu. Spójrzmy na poniższy kod:

```typescript
const observable = new Observable<number>();
const subscription = observable.subscribe(console.log);

subscription.unsubscribe();
observable.unsubscribe(subscription);
```

Cały kod łącznie z bardzo prostym przypadkiem użycia został umieszczony [tutaj](https://stackblitz.com/edit/ts-observable).

## Podsumowanie

Jeśli jesteście związani z Angularem mniej lub bardziej, albo po prostu znacie bibliotekę RxJs, to mogliście zauważyć, że mocno się nią inspirowałem. Uważam, że do obsługi zdarzeń asynchronicznych jest ona świetna i szczególnie w Angularze świetnie się sprawdza. Ma też wiele operatorów, która bardzo rozszerzają jej możliwości. Natomiast sam Observable kiedyś miał być wciągnięty do EcmaScript jako standard: [https://github.com/tc39/proposal-observable](https://github.com/tc39/proposal-observable). Niestety od 2017 ten temat nie jest poruszany przez organizację TC39.

Oczywiście jest to stosunkowo prosta implementacja tego wzorca i wiele można byłoby jeszcze usprawnić. Na przykład asychroniczność mogłaby być opcjonalna, bo nie zawsze jest taka potrzeba. Przydałoby się też dodać obsługę błędów, albo informowanie obserwatorów o tym, że Observable już nie będzie publikował nowych wartości (status _complete_). Jednak myślę, że udało mi się zrealizować podstawowy cel, czyli nakreślić czym jest ten wzorzec i w jaki sposób napisać jego prostą generyczną implementację w Typescript.
