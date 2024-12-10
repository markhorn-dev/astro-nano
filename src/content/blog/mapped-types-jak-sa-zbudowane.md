---
title: "Mapped types - jak są zbudowane"
date: "2020-12-08"
categories: 
  - "typescript"
tags: 
  - "javascript"
  - "mapped-types"
  - "typescript"
author:
    name: Marek Szkudelski
    picture: '/assets/blog/authors/face.png'
ogImage:
  url: ''
level: "Średniozaawansowany"
description: 'Uważam, że Mapped Types są często niedocenianym elementem TSa, więc w artykule pokazuję kilka z tych typów oraz wchodzę do środka, żeby pokazać jak można budować swoje własne typy.'
---

Mapped types są w moim odczuciu stosunkowo mało znanym i przez to niedocenianym feature'em Typescript'a. Chciałbym omówić kilka najczęściej przez mnie używanych typów i pokazać jak są one zbudowane w środku. Zrozumienie ich mechanizmu jest bardzo pomocne przy tworzeniu własnych mapped types i daje duże możliwości.

## Ogólna budowa mapped types

Czym właściwie są mapped types? Zgodnie z dokumentacją Typescript'a można tak nazwać każdy typ, który modyfikuje każdą właściwość innego typu w taki sam sposób i zwraca nowy typ. Spójrzmy jak to wygląda w praktyce:

```typescript
type Mapped<T> = {
  [P in keyof T]: T[P];
}
```

Powyżej widzimy generyczny alias typu, którym jest obiekt. Jednak ten obiekt nie ma z góry zdefiniowanych właściwości. Zamiast tego iteruje on po każdym kluczu przekazanego typu **T** i ustala typ dla tego klucza. W tym prostym przypadku nie zachodzi żadna modyfikacja i typ jest po prostu przepisywany. **T\[P\]** oznacza wzięcie typu spod klucza **P** w obiekcie/interfejsie **T**. Pewnie już widzicie, że taki typ **Mapped** nic nie robi szczególnego oprócz przepisania typu. W innych przypadkach zachodzi jakaś modyfikacja. Można więc powiedzieć, że mapped type mapuje właściwości przekazanego typu - stąd właśnie ich nazwa 😉.

### O słowie keyof słów kilka

Warto wspomnieć w paru zdaniach czym jest to słowo kluczowe **keyof.** Jest to operator z Typescript'a, więc dotyczy tylko typów i zwraca wszyskie klucze przekazanego typu w formie union type'a. Na przykład jeśli typ ma dwie właściwości **name** oraz **age**, to **keyof** zwróci typ, który będzie zestawem literalnych stringów - **name** oraz **age**.

```typescript
type Keys = keyof { 
  name: string, age: number, 
} // 'name' | 'age'
```

Nie zawsze trzeba mieć typ danego obiektu, żeby wyciągnąć jego klucze. Możemy użyć obiektu jako wartości, a nie typu i zamienić go na typ z pomocą **typeof**.

```typescript
const person = { name: 'Jan', age: 95 }
type Keys = keyof typeof person // 'name' | 'age'
```

## Przykładowe wbudowane mapped types

Chciałbym omówić parę według mnie najbardziej przydatnych mapped types. Listę wbudowanych mapped types możesz znaleźć w dokumentacji Typescript'a - [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html). Postaram się omówić też jak są zbudowane w środku, żebyśmy mogli bez problemu przejść do budowy własnych mapped types.

## Record

Record to typ, który jest używany do tworzeniu typu obiektu o konkretnych kluczach, gdzie każda właściwość ma wartość takiego samego typu. Przyjmuje on dwa typy generyczne, z których jeden to zbiór kluczy, a drugi to typ wartości dla każdego klucza. Spójrzmy jak on wygląda w środku:

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
}
```

Wydaje mi się, że wszystko powinno być jasne jeśli przeczytaliście akapit o budowie mapped types, ale jedna rzecz może nie być taka oczywista, a mianowicie **keyof any**. To wyrażenie zwraca union type złożony z typów string, number i symbol. Jest tak dlatego, że mając element o typie **any** możemy odwołać się do jakiejkolwiek właściwości tego elementu, a w Javascript kluczem może być string, number albo symbol.

Do czego właściwie można użyć taki typ? Jest kilka zastosowań Record'u. Po pierwsze, wyobraźmy sobie, że pobieramy jakąś konfigurację gdzie są różne pola będące stringami. Możemy na sztywno wypisać wszystkie pola i nadać im typ **string**, albo użyć **Record**'u i przekazać klucze jako **union type**. Oczywiście zakładamy, że wszystkie pola będą stringami, a może tak nie być.

```typescript
type ConfigFields = 'env' | 'db_host' | ...;
type Config = Record<ConfigFields, string>;
```

Bardziej realnym użyciem byłoby typowanie słownika z tłumaczeniami. Utwórzmy więc nowy typ **Dictionary**, który jest generyczny i przyjmuje listę obsługiwanych języków.

```typescript
type Languages = 'pl' | 'en';
type Dictionary<Langs extends string> = Record<string, Record<Langs, string>>;

const dictionary: Dictionary<Languages> = {
  WORD: {
    pl: 'słowo',
    en: 'word',
    de: '' // error! 
  },
}
```

Mamy tutaj dwa zagnieżdżone **Record**'y. Pierwszy ustala relację pomiędzy danym słowem i jego tłumaczeniem. Słowo może być dowolnym stringiem, natomiast tłumaczenia mają być obiektem, gdzie klucze to będą obsługiwane języki, a wartości - znowu dowolne stringi. Napisanie tłumaczenia do niewspieranego języka będzie powodowało błąd. Również pominięcie jakiegoś tłumaczenia będzie skutkowało błędem w czasie transpilacji kodu.

## Required i Partial

Kolejnym typem, który chcę omówić jest **Required** i powiem też przy okazji o jego przeciwieństwie, czyli **Partial**. Typ **Required**, jak nazwa wskazuje, powoduje, że każda właściwość przekazanego typu staje się wymagana. Możecie się zastanawiać jak Typescript to robi skoro nie ma operatora, ani modyfikatora, który determinuje wymagalność właściwości. Otóż **Required** tak naprawdę usuwa opcjonalność właściwości przez **operator "-" (minus)**. Spójrzmy w kodzie:

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P];
}
```

Operatora minus możemy też użyć w innych kontekstach. Na przykład możemy napisać typ, który powoduje, że każda właściwość będzie zarówno do odczytu jak i do zapisu. Tak jak możemy usunąć **optional operator**, tak możemy usunąć modyfikator **readonly**.

```typescript
type ReadWrite<T> = {
  -readonly [P in keyof T]: T[P]
}
```

Usuwanie modyfikatora readonly oraz operatora optional to jedyne znane mi zastosowania operatora **minus**. Jeśli znasz jakieś inne, albo masz jakiś inny pomysł to daj znać 😉

Jak możecie się domyślać **Partial** działa w odwrotny sposób. Zamiast usuwać **optional operator** - dodaje go.

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
}
```

W przypadku tych dwóch typów - **Required** i **Partial** - zastosowań jest mnóstwo. Jedno z tych, które pierwsze przychodzą mi na myśl, to edycja - na przykład użytkownika. Możemy to zrobić metodą HTTP PUT, albo PATCH. Przy użyciu pierwszej musimy podać wszystkie pola, a druga wymaga jakiegokolwiek.

```typescript
interface User {
  id?: string;
  name: string;
  age: number;
}

declare function editUser(user: Required<User>);
declare function patchUser(user: Partial<User>);
```

Oczywiście jeśli dłużej się przyjrzymy powyższemu typowaniu, to zauważymy, że nie jest to idealne rozwiązanie. Co jeśli **User** będzie miał opcjonalne pole **email**? W przypadku edycji będziemy go wymagać pomimo to. Natomiast w przypadku **patchUser** nie wymagamy pola **id**, które jest konieczne, żeby zidentyfikować użytkownika. Przejdźmy do kolejnych mapped types, które pomogą nam rozwiązać te problemy.

## Pick i Omit

Kolejne typy też są swoimi przeciwieństwami. Dzięki typowi **Pick** możemy wybrać konkretne właściwości z danego interfejsu. Natomiast dzięki **Omit** możemy wybrać wszystkie właściwości poza wyszczególnionymi.

Przyjrzyjmy się najpierw typowi **Pick**. Przyjmuje on dwa argumenty. Pierwszy z nich, to jakikolwiek typ, a drugi, to zestaw kluczy tego typu. Jego struktura jest bardzo podobna do typu **Required** lub **Partial**, ale zamiast iterować się po **keyof T** - iterujemy się po **K**, które rozszerza **keyof T**, czyli jest dowolnym podzbiorem zbioru wszystkich kluczy typu **T.** Natomiast typ każdej właściwości jest po prostu przepisywany.

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

Następnym typem jest **Omit**, który sam w sobie nie ma struktury mapped type, ale wykorzystuje dwa inne mapped types, żeby osiągnąć swój cel. Tak jak typ **Pick**, **Omit** również przyjmuje dwa argumenty typów. Pierwszy to dowolny typ, a drugi ma rozszerzać **keyof** **any**, czyli ma być zbiorem jakichkolwiek kluczy. Dlaczego nie rozszerzamy **keyof T**? Takie ograniczenie byłoby zbędne, ponieważ **Omit** i tak zwróci nam poprawny podzbiór właściwości **T**. To czy przekażę tam 10 innych string'ów, których nie ma wśród kluczy przekazanego typu, nie zmieni efektu końcowego.

```typescript
type Omit<T, K extends keyof any> = Pick<
  T, Exclude<keyof T, K>
>;
```

Natomiast w środku typu **Omit** widzimy wykorzystanie typu **Pick**, omawianego wcześnie, oraz typ **Exclude**. Nie będę się zagłębiał teraz w budowę kolejnego typu, ale **Exclude** w tym przypadku zwraca zestaw string'ów ze zbioru **keyof T**, ale wykluczając zbiór **K**.

### Zastosowanie

Poznaliśmy teorię na temat typów **Pick** oraz **Omit**, a teraz zobaczmy jak można wykorzystać je w praktyce na przykładzie naszych funkcji do modyfikowania użytkownika.

Przypomnę tylko, że w funkcji **editUser** chcieliśmy zachować opcjonalność każdej właściwości oprócz pola **id**. Natomiast w **patchUser** chcieliśmy wymagać tylko pola **id**. Podsumowując te dwa wymagania można powiedzieć, że w obu przypadkach chcemy dodać pole id jako wymagane.

```typescript
interface User {
  id?: string;
  name: string;
  age: number;
}

type RequiredUserId = Required<Pick<User, 'id'>>;

declare function editUser(user: User & RequiredUserId);
declare function patchUser(user: Partial<User> & RequiredUserId);
```

Jedyna rzecz, która doszła do naszego kodu, to typ **RequiredUserId** i jego wykorzystanie przy typowniu tych dwóch funkcji. Typ ten wybiera pole **id** z interfejsu **User** dzięki **Pick** i czyni to pole wymaganym dzięki **Required**. Jednak takie rozwiązanie jest bardzo specyficzne i możemy je wykorzystać tylko w przypadku tego konkretnego problemu z edytowaniem użytkownika. Spróbujmy więc uczynić ten typ bardziej generycznym.

```typescript
type RequireFields<
  T, K extends keyof T
> = Required<Pick<T, K>>;

type RequireOnly<
  T, K extends keyof T
> = Partial<T> & Required<Pick<T, K>>;
```

Powyżej zadeklarowałem dwa nowe typy. Przyjmują one dwa argumenty typów, więc są generyczne i nie bazują na zadeklarowanych wcześniej interfejsach. Pierwszym z nich jest dokładnie tym samym typem co **RequiredUserId**, ale zadziała dla każdego typu - nie tylko interfejsu **User**. Drugi z nich natomiast tak naprawdę rozszerza pierwszy przez dodanie wszystki pól z **T** jak opcjonalnych. To nam pozwala oczekiwać danego interfejsu, ale wymagać tylko niektórych pól z niego.

```typescript
interface User {
  id?: string;
  name: string;
  age: number;
}

declare function editUser(user: User & RequireFields<User, 'id'>);
declare function patchUser(user: RequireOnly<User, 'id'>);
```

Powyższy zapis działa dokładnie tak samo jak wcześniej, ale po pierwsze stworzyliśmy dwa reużywalne mapped types, a po drugie funkcja patchUser wygląda teraz nieco czytelniej.

## Customowy mapped type

Dobra, mamy już mocną podstawę z budowy i działania mapped types. Umiemy też wykorzystywać je do tworzenia swoich własnych customowych typów. Spróbujmy teraz utworzyć całkiem nowy mapped type od zera.

Założenia są następujące. Mamy obiekt, który trzyma maksymalne dozwolone długości string'ów w polach dość dużego formularza. Chcemy ten obiekt poprawnie otypować. Nie będziemy się skupiać na żadnym framework'u, ale załóżmy, że mamy do czynienia z komponentem, który jest klasą. Taki obiekt bez żadnych typów i modyfikatorów mógłby wyglądać tak:

```typescript
class Component {
  formValidationMaxLengths = {
    city: 20,
    street: 50,
    postCode: 6,
    firstName: 20,
    lastName: 20,
    phoneNumber: 16,
    secondaryPhoneNumber: 20,
    companyName: 30,
  }
}
```

Właściwość nie jest otypowana, ale Typescript wywnioskuje typ tego literalnego obiektu i w naszym IDE będziemy mieli podpowiedzi poszczególnych pól. Jednak są dwa główne problemy. Pierwszy z nich to możliwość nadpisania obiektu nową wartością. Drugi problem to możliwość nadpisania każdej właściwości nową wartością. Raczej chcielibyśmy, żeby nasz kod był przewidywalny i nie chcemy zagłębiać się w kod klasy, żeby stwierdzić jak walidacja będzie wyglądać ostatecznie. Dodajmy więc dwie proste rzeczy do naszego kodu.

```typescript
class Component {
  readonly formValidationMaxLengths = Object.freeze({
    city: 20,
    street: 50,
    postCode: 6,
    firstName: 20,
    lastName: 20,
    phoneNumber: 16,
    secondaryPhoneNumber: 20,
    companyName: 30,
  })
}
```

Modyfikator **readonly** zabroni podstawiać nowe wartości pod naszą właściwość. Natomiast **Object.freeze** czyni ten obiekt niemutowalnym. To znaczy, że nie możemy przypisać nowej wartości pod żadną z jego właściwości. Teraz nasz obiekt jest odporny na wszelkie zmiany podczas działania klasy, ale wciąż możemy zmienić jego zawartość przy deklaracji. Aby temu zapobiec musimy dodać jakiś explicit typ (otypować wprost). Tutaj właśnie przyszła pora na nasz customowy mapped type.

```typescript
interface UserData { 
  city: string,
  street: string,
  postCode: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  secondaryPhoneNumber: string,
  companyName: string,
}

type MaxLengths<T extends {}> = {
  readonly [P in keyof T]: number;
}

class Component {
  readonly formValidationMaxLengths: MaxLengths<UserData> = ...;
}
```

Powyżej zadeklarowałem interfejs **UserData**, który określa jakie pola ma zawierać ten formularz. Następnie stworzyłem typ **MaxLengths**, który ma trzy bardzo ważne odpowiedzialności umożliwiające nam zabezpieczenie naszego obiektu.

1. **readonly** - określamy, że każde pole jest tylko do odczytu, więc nie można podmienić jego wartości;
2. **P in keyof T** - dzięki iteracji po właściwościach typu **T** wymuszamy by obiekt miał wszystkie pola z przekazanego interfejsu;
3. **number** - na koniec ustalamy, że każde pole ma mieć wartość typu **number**, bo tylko taki typ na sens dla maksymalnych długości pól

### Alternatywne rozwiązanie

Jak możecie zauważyć, analizując deklarację metody **Object.freeze**, zwraca ona obiekt już przemapowany przez typ **Readonly**. Oznacza to, że Typescript wywnioskuje z tej deklaracji, że każde pole naszego obiektu jest tylko do odczytu i nie pozwoli nam go zmienić. Jednak to w żaden sposób nie wymusza zdefiniowania każdego pola z interfejsu **User**. Oczywiście to metoda jest generyczna, więc moglibyśmy do niej przekazać ten interfejs, ale wtedy Typescript będzie oczekiwał wartości pól zgodnych z typami w interfejsie, czyli string'ów, a my chcemy tam umieścić **number**'y. Moglibyśmy przemapować interfejs **User** w inny sposób, podstawiając number pod wartości pól. Takie alternatywne rozwiązanie mogłoby wyglądać tak:

```typescript
class Component {
  readonly formValidationMaxLengths = Object.freeze<
    Record<keyof UserData, number>
  >(...);
}
```

Ciężko tutaj osądzić, które rozwiązanie można uznać za lepsze. Pierwszy typ jest reużywalny i jego nazwa wskazuje dokładnie na cel istnienia takiego typu i jego odpowiedzialność. Drugi też możnaby było wyekstraktować jako generyczny typ - bez powiązania z **UserData**. Jednak będzie on do użycia tylko jako argument typu przekazywany do **Object.freeze**. Tak naprawdę jeśli nie obawiamy się jakiś zmian w runtime'ie, to moglibyśmy pozbyć się tej metody i polegać tylko na typie **MaxLength**.

> Wszystkie przykłady możesz sobie podejrzeć i przeanalizować [tutaj](https://stackblitz.com/edit/mapped-types-examples?file=index.ts).

## Podsumowanie

Poznaliśmy kilka typów z rodziny mapped types, ale jest ich o wiele więcej, więc zachęcam do lektury dokumentacji Typescript'a. Uważam, że jest to potężne narzędzie, ponieważ oprócz wielu przydatnych typów Typescript dostarcza nam sposób na budowanie własnych typów i tutaj tak naprawdę ogranicza nas tylko nasza kreatywność :). Jest to też kolejny dobry przykład tego, że warto badać wnętrza używanych przez nas technologii, ponieważ daje nam to wiedzę, która może nam pomagać w codziennej pracy.
