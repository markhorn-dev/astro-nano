---
title: "Typ any - praktyczne zastosowania"
date: "2021-02-16"
categories: 
  - "typescript"
tags: 
  - "javascript"
  - "typescript"
  - "types"
  - "any types"
author:
  name: Marek Szkudelski
  picture: '/assets/blog/authors/face.png'
ogImage:
url: ''
level: "Podstawowy"
published: 'true'
description: 'Myślę, że typ `any` wywołuje sporo kontrowesji. Przez jednych jest nadużywany, a przez drugich w ogóle odradzany. Postanowiłem więc podsumować wszystkie znane mi przypadku użycia typu `any` w artykule.'
--- 


> **Update: 26.02.2021**
>
> Opublikowałem [artykuł](https://blog.szkudelski.dev/posts/unknown-czyli-dlaczego-nie-stosować-typu-any), który obala stwierdzenia postawione w tym wpisie. Objaśniam w nim, dlaczego zastosowania typu `any` z tego artykułu są niepoprawne i przybliżam typ `unknown`. 
> **[Unknown, czyli dlaczego nie stosować typy any](https://blog.szkudelski.dev/posts/unknown-czyli-dlaczego-nie-stosować-typu-any)**

> **Update: 18.02.2021**
>
> Po dyskusji na grupie FB ([JS news: after hours](https://www.facebook.com/groups/257881290932879/permalink/3716101888444118/) - link zadziała jeśli masz dostęp) muszę przyznać, że niestety nie mam racji w większości tego artykułu. **Dlatego nie zachęcam Cię do czytania go.** Wkrótce pojawi się nowy artykuł, w którym wyjaśnię, dlaczego ten praktycznie cały jest do wyrzucenia.

## Wstęp

Niby wszyscy wiedzą o tym, czym jest **typ `any`**, ale jednak uważam, że wywołuje on sporo **kontrowersji**. Mniej doświadczeni programiści go **nadużywają**, a przez tych bardziej doświadczonych jest on najczęściej **odradzany**. Postanowiłem więc podsumować wszystkie znane mi **przypadku użycia** typu `any` w tym artykule.

## Dlaczego raczej nie używać typu any?

Na ogół nie zaleca się nadmiernego używania tego typu ze względu na to, że TypeScript nie kontroluje co będziemy robić ze zmienną typu `any`. Pozwala na odwoływanie się do **każdej** właściwości oraz metody. Poprzez ten typ mówimy TypeScriptowi, że mamy do czynienia z czymkolwiek, więc może to być również **dowolny obiekt z dowolnymi metodami**. Jeśli wywołamy metodę, która nie istnieje, to dostaniemy błąd, ale nie podczas kompilacji, a w przeglądarce. Może to prowadzić **do błędów w runtime’ie**, przed którymi TS ma nas ustrzec. Jednak jest kilka praktycznych zastosowań tego typu.

## Kolekcja czegokolwiek

Po pierwsze możemy użyć `any` jeśli spodziewany się dosłownie czegokolwiek. Na przykład **tworzymy kolekcję przeróżnych wartości i nie za bardzo interesuje nas, co będzie w tej kolekcji.**

Świetnym przykładem jest tutaj sam **ReactJs**, a dokładniej to, w jaki sposób ma otypowane zależności do hooków. Zobaczmy sobie na deklarację typu dla `useEffect`. `deps` jest tablicą tylko do odczytu i ta tablica może zawierać jakiekolwiek wartości. 

```tsx
function useEffect(
    effect: EffectCallback,
    deps?: DependencyList,
): void;
type DependencyList = ReadonlyArray<any>;
```

*Dlaczego twórcy Reacta nie zawęzili tutaj typowania i pozwalają na przekazanie czegokolwiek?* Aby odpowiedzieć na to pytanie, trzeba najpierw uświadomić sobie, **do czego służą te zależności**. React po każdym renderze komponentu porównuje nowe wartości przekazane w `deps` ze starymi (tymi, które byłe przekazane przy poprzednim renderze), żeby zobaczyć czy się zmieniły. Jeśli zmieniły się, to wykonuje się callback (tutaj parametr `effect`), a jeśli nie to nic się nie zadzieje.

Jeśli mamy porównać stare wartości z nowymi i interesuje nas tylko, to czy się zmieniły, to tak naprawdę nieważne, jaki mają typ. **Operator porównania** (`===` lub `==`) jest generyczny i uniwersalny dla każdego typu.

## Nieznajomość kontraktu

Drugie zastosowanie typu `any` ma miejsce **jeśli jeszcze nie znamy typu, a chcemy już zacząć implementować** dany feature. Aby nie spowalniać developmentu, to możemy dodać typ `any` i zaimplementować funkcję, a potem zmienić typ i ewentualnie dostosować implementację do już znanego typu. Załóżmy, że implementujemy koszyk i chcemy utworzyć jego klasę, ale nie chcemy czekać, aż kontrakt API zostanie ustalony. Możemy zgadywać typy i struktury danych albo klasę otypować w taki sposób:

```tsx
class Cart {
  constructor(private items: any[]) {}

  addItem(item: any) {}

  getItem(id: string): any {
    return this.items.find(
        (item) => item.id === id,
    );
  }
} 
```

Jednak kiedy przyjdzie moment, w którym poznamy kontrakt, może nam być ciężko, żeby podmienić typ `any` na odpowiedni model. Może się zdarzyć, że któreś miejsce pominiemy - szczególnie przy modelu używanym w wielu miejscach. Dlatego warto dodać sobie **alias typu** do miejsc, w których nie znamy dokładnej struktury, ale wiemy, że to będzie na pewno ten sam model.

```tsx
type CartProduct = any;
 
class Cart {
  constructor(private items: CartProduct[]) {}

  addItem(item: CartProduct) {}

  getItem(id: string): CartProduct {
    return this.items.find(
        (item) => item.id === id,
    );
  }
} 
```

Co nam to daje? Kiedy zostanie ustalony kontrakt API, będziemy mogli skupić się na ewentualnych poprawkach implementacyjnych, a typ nadać tylko w jednym miejscu. Np. może okazać się, że pole `id`, nie nazywa się już tak, ale ma nazwę `_id` (wiem - skrajny przypadek). Jeśli mielibyśmy wszędzie typ `any` i zapomnielibyśmy podmienić ten typ na przykład w metodzie `getItem`, to mielibyśmy błąd w runtime'ie. Natomiast **jeśli mamy alias typu, to tylko podmieniamy typ w jednym miejscu**, a o błędnych założeniach poinformuje nas TypeScript.

## Migracja z czystego JSa

Trzeci przypadek użycia, o którym warto wspomnieć, jest wtedy, **kiedy migrujemy większy projekt z czystego JavaScriptu**. W przypadku mniejszego projektu zazwyczaj jesteśmy w stanie zrobić to w ciągu najwyżej kilku godzin. Natomiast jeśli projekt jest większy, to możemy na początku napotkać trudności z dodaniem typów wszędzie na raz. A miejsca, w których nie dodamy typów, mogą powodować uruchomieniem projektu z błędami kompilacji. W tym przypadku możemy dodać `any` w miejscach, gdzie dostajemy błędy i potem stopniowo - już na działającym projekcie - dodawać konkretne typy. **Takie rozwiązanie oczywiście powinno być tymczasowe.**

## Operacje na samych kluczach

Ostatnie zastosowanie, jakie znalazłem, to moment **kiedy operujemy na kluczach obiektu**. Kiedy chcemy otypować funkcję, która nam przemapuje klucze w jakiś sposób, to nie potrzebujemy znać typów wartości. To znaczy, potrzebujemy, ale tylko do typu zwracanego przez funkcję, a w jej ciele jest nam to zupełnie niepotrzebne.

```tsx
function mapFields<
  T extends Record<string, any>,
>(object: T) {
    return object;
}
```

Popatrz na przykład powyżej. Jest bardzo uproszczony, ale chcę tylko nakreślić koncepcję. Określamy, że parametr `object` ma rozszerzać `Record` o kluczach, które są stringiem, a wartości mają być `any`. 

> Jeśli chcesz dowiedzieć się czym jest typ `Record`, to zapraszam Cię do mojego artykułu o [Mapped Types](https://blog.szkudelski.dev/posts/mapped-types-jak-sa-zbudowane).

Takie rozwiązanie jest poprawne, dopóki nie będziemy odwoływać się do wartości. Nie możemy na przykład wywołać ich jako funkcji albo odwołać się zagnieżdżonych właściwości. Jeśli potrzebujemy to zrobić, to musimy dokładniej określić kształt przekazywanego obiektu oraz jakie mogą być tam wartości. Jeśli byśmy tego nie zrobili, to mógłby wystąpić błąd, o którym pisałem we wstępie.

Mówiąc innymi słowy, określamy tylko kształt, jaki ma mieć nasz obiekt. Nie wskazujemy, czym dokładnie ma być, a jedynie definiujemy zarys. Możemy to zrobić, ponieważ w zasadzie nie obchodzi nas, co będzie w środku. Interesuje nas to, że kluczami będą stringi.

> **Update: 17.02.2021**
>
> Tak naprawdę ostatni przypadek użycia jest nie do końca poprawny. Owszem, chcemy tylko określić kształ obiektu, ale `any` może doprowadzić do błędów wewnątrz funkcji. Aby zapobiec takim błędom, powinniśmy użyć typu `unknown` dla wartości obiektu, zamiast `any`.
> Podziekowania dla Tomasza Ducina za tę uwagę! 

## Podsumowanie

Wydaję mi się, że przekazałem wam wszystkie poprawne przypadki użycia typu `any`, z którymi ja spotkałem się w pracy. Jeśli spotkaliście się w jakiejś innej sytuacji z **poprawnym** **użyciem typu `any`**, to możecie dać mi znać. Chętnie poznam inne podejścia do tego typu 🙂

Podsumujmy teraz jakie są **zastosowania** typu `any` w TypeScript. Można je tak naprawdę podzielić na dwie grupy:

1. **Kiedy nie interesuje nas zawartość, a jedynie ogólny kształt.** Np. kiedy chcemy zbierać jakiekolwiek wartości, albo przekazać obiekt, którego tylko klucze są nam potrzebne.
2. **Kiedy tymczasowo chcemy ułatwić sobie pracę.** Np. kiedy jeszcze nie znamy kontraktu API, albo migrujemy nasz projekt do TypeScriptu.
