---
title: "Unknown, czyli dlaczego nie stosować typu any"
date: "2021-02-26"
categories: 
  - "typescript"
tags: 
  - "javascript"
  - "typescript"
  - "types"
  - "any type"
  - "unknown type"
  - "best practices"
author:
  name: Marek Szkudelski
  picture: '/assets/blog/authors/face.png'
ogImage:
url: ''
level: "Podstawowy"
published: 'true'
description: 'W tym artykule obalam tezy, które postawiłem w poprzednim wpisie o typie `any`. Przybliżam typ `unknown` oraz to dlaczego jest lepszym rozwiązaniem przy typowanie niż `any`.'
--- 

## Wstęp

Ostatnio opublikowałem artykuł o tym, kiedy w praktyce można zastosować typ `any` w projekcie napisanym w TypeScript. Po wrzuceniu na Facebooka okazało się, że spotkał się on ze słuszną krytyką. (link do posta w grupie [JS news - after hours](https://www.facebook.com/groups/257881290932879/permalink/3716101888444118/) - może się okazać, że nie masz dostępu). Chciałbym teraz podsumować wnioski z tej dyskusji i wyjaśnić, dlaczego nie miałem racji. Sam artykuł znajduje się [tutaj](https://blog.szkudelski.dev/posts/typ-any---praktyczne-zastosowania). Raczej nie zalecam go czytać pod kątem merytorycznym, ale warto mieć kontekst tego, jak doszedłem do takich wniosków.

Na wstępie chciałbym podziękować wszystkim, którzy poświęcili czas na przeczytanie mojego poprzedniego artykułu i zostawienie komentarza z wyjaśnieniem, dlaczego moje rozwiązania są niepoprawne. Tutaj też pojawia się pozytywny wniosek z prowadzenia bloga. **Publikując treści, dajemy innym szansę na zweryfikowanie naszej wiedzy.** Gdybym trzymał wszystko to, czego się nauczę dla siebie, to możliwe, że nigdy bym się nie dowiedział, że nie mam racji. Możliwe nawet, że zastosowane przeze mnie błędnego rozwiązania spowodowałyby błąd w aplikacji, którą rozwijam w pracy. Dzięki prowadzeniu bloga i dzieleniu się wiedzą, mogę uniknąć pomyłek i sam czegoś się nauczyć.

## O typie `unknown`

Typ `unknown` jest właściwie tym, na co wskazuje jego nazwa. **Opisuje on wartość nieznaną nam podczas developmentu**. Pod zmienną o takim typie może się kryć jakakolwiek wartość. Można więc zapytać, czym różni się on od `any`. Tym, że jest bezpieczniejszy. TypeScript nie pozwoli na wykonanie żadnej operacji na zmiennej z typem `unknown`, dopóki nie potwierdzimy, jaki to jest dokładnie typ. Można to zrobić na przykład dzięki mechanizmowi, który się nazywa `type guards`, czyli strażnicy typu. Jednak za nim o nich dokładniej opowiem, to spójrzmy, jak się zachowuje TypeScript, kiedy ma do czynienia z typem `unknown`.

```tsx
let a: unknown = '123';
let b: number = a; // error
a = 123; // Ok
```

Po pierwsze, w powyższym przykładzie możemy zobaczyć, że **TypeScript nie pozwoli nam na przypisanie czegoś, co jest `unknown` do zmiennej typu number**. Pozwoli natomiast na przypisanie czegokolwiek do tej zmiennej. Dlaczego tak jest? Ponieważ mówimy TypeScriptowi, że nie wiemy, jaka może być tam wartość. Jeśli TS pozwoliłby nam przypisać wartość spod zmiennej `a` do zmiennej `b`, to moglibyśmy wywołać na tej wartości każdą metodę charakterystyczną dla numberu. Spowodowałoby to błąd w runtime'ie, a przed tym TypeScript powinien nas uchronić.

## Kolekcja czegokolwiek

W artykule o `any` podałem przykład z tablicą zawierającą `any` oraz obiekt z wartościami o takim typie. Na pierwszy rzut oka typowanie może się wydawać prawidłowe i praktyczne. Jednak jest z nim jeden problem. Owszem z zewnątrz nie ma różnicy czy argument funkcji ma `unknown`, czy `any`. Natomiast **z punktu widzenia programistów, który taką funkcję piszą i utrzymują, `any` może prowadzić do błędów.** 

Załóżmy, że piszemy funkcję, która sprawdza, czy dana wartość znajduje się w tablicy. Tak, wiem, że jest taka funkcja w czystym JS, ale chcemy mieć możliwość późniejszej rozbudowy funkcji o dodatkowe opcje, więc piszemy ją sami. Chcemy, żeby funkcja powiedziała nam czy wartość występuje przynajmniej raz w przekazanym zbiorze danych. Na pierwszy rzut oka poniższe typowanie jest poprawne. Nie obchodzi nas jaki typ ma tablica, ani wartość. Nie zależy nam też na tym, żeby typy były takie same (wtedy użylibyśmy typu generycznego). Co może pójść nie tak?

```tsx
function includes(array: any[], value: any): boolean {
  return array.some(item => item === value);
}

console.log(includes([123], 123)) // true
console.log(includes([123], 13)) // false
```

Wyobraźmy sobie, że chcemy dodać opcję sprawdzania także tablic zagnieżdżonych w poszukiwaniu danej wartości. Implementacja mogłaby wyglądać tak:

```tsx
function includes(array: any[], value: any): boolean {
  return array.some(
    item => item === value || includes(item, value),
  );
}

console.log(includes([123, [13]], 13)) // true
```

Jeśli element tablicy nie spełnia warunku, to wywołaj rekurencyjnie funkcję `includes` z tym elementem. Widzicie już błąd, który pokaże się w konsoli? Będzie to błąd: `array.some is not a function`. Programista rozwijający tę funkcję popełnił błąd. Nie sprawdził, czy `item` jest tablicą przed wywołaniem metody `includes`. TypeScript nie narzeka dlatego, że poinformowaliśmy go, że elementy tablicy mogą być czymkolwiek - również tablicą. Zobaczmy, jak można za pomocą poprawnego typowania zapobiec takim błędom.

Przede wszystkim zamieńmy typ argumentu `array` na tablicę o typie `unknown`. Od razu możemy zobaczyć błąd kompilatora:

```
Argument of type 'unknown' is not assignable to parameter of type 'unknown[]'.
```

TypeScript nie wie, czy `item` może być tablicą, więc nie pozwoli nam go przekazać do funkcji `includes`. Teraz wiemy o potencjalnym błędzie w runtime'ie, więc możemy się na niego przygotować, sprawdzając, czy element tablicy jest także tablicą. Ostateczna implementacja mogłaby wyglądać w taki sposób:

```tsx
function includes(array: unknown[], value: unknown): boolean {
  return array.some(
    item => item === value || 
    Array.isArray(item) && includes(item, value),
  );
}
```

## Inne przypadki

**Błąd podobnego rodzaju jak ten, który opisałem powyżej, może zdarzyć się tak naprawdę wszędzie gdzie zostawimy `any` jak typ w naszym kodzie.** Dlatego warto używać `unknown` zamiast `any`. Podobny przykład jak ten powyżej mógłbym pewnie znaleźć na przypadek mapowania kluczy z poprzedniego artykułu.

Jeśli chodzi o przykład z hookami w ReactJs, to nasuwa mi się pytanie, dlaczego twórcy tej biblioteki nie użyli `unknown`? Oczywiście nie wiem dlaczego, ale odpowiedź może być bardzo prosta. Mogło to wynikać z niewiedzy albo z niedopatrzenia programistów. Ludzie rozwijający publiczne projekty nie są nieomylni i też zdarzają im się pomyłki.

> Trochę więcej o błędach w open source'owych projektach piszę w moim [pierwszym artykule, gdzie analizuję kod źródłowy async pipe'a z Angulara](https://blog.szkudelski.dev/posts/async-pipe-w-angular-szczegolowa-analiza).

Co natomiast z pozostałymi przypadkami użycia typu `any`, które opisałem w tamtym artykule?

## Brak kontraktu API

Tak naprawdę totalny brak znajomości prawdopodobnego kontraktu API, to bardzo rzadki przypadek. Mam nadzieję, że nikomu to się na zdarza w pracy, ponieważ są to bardzo niekomfortowe warunki do pracy. **Myślę, że w praktycznie każdej sytuacji możemy wcześniej dogadać się z backendem odnośnie do kontraktu**. Jeśli nie, to możemy popełnić sami pewne założenia. 

Prawdą jest, że nawet jeśli nie znamy kontraktu, to podczas implementacji i tak zakładamy na przykład, to jak będzie się nazywać pole, albo jakiego będzie typu. Takie założenia wystarczy przenieść do TypeScriptowego interfejsu. **Na nasze szczęście współczesne IDE bardzo często oferują narzędzia do bardzo łatwego refaktoru takiego jak zmiany w nazwach pól.** Więc w sytuacji, kiedy okaże się, że kontrakt jednak będzie nieco odbiegał od naszych założeń, to będziemy mogli w miarę prosty sposób dostosować się do tego.

## Migracja z czystego JS

Jak natomiast sytuacja wygląda z migracją większego projektu z czystego JavaScriptu do TypeScripta? Kiedy dostajemy na twarz kilkaset błędów kompilacji, to aż się chce dać wszędzie `any` i skupić się na przyrostowym dodawaniu typów do naszego projektu.

Kiedy wrócimy do źródła, czyli oficjalnej dokumentacji TypeScripta i poczytamy o migracji projektu z JSa, to okaże się, że jest lepsza droga. **Kompilator TypeScripta przyjmuje opcję konfiguracyjną `"allowJs"`, którą możemy ustawić na `true` lub `false`. Dzięki włączonej takiej opcji możemy mieć pliki JavaScriptowe oraz TypeScriptowe i jednym projekcie.** Kompilator sobie z tym poradzi i da nam działający projekt. W dalszym ciągu możemy dodawać typy przyrostowo. Na początek możemy zmienić tylko jeden plik z .js na .ts, dodać typy i dorzucić takie zmiany do repozytorium. W kolejnych dniach możemy zmieniać rozszerzenia kolejnych plików i typować je. Dzięki temu uchronimy się przed sytuacjami, kiedy pozostawimy gdzieś jakieś zapomniane `any` w przepisanym projekcie. 

## Podsumowanie

Odniosłem się do każdego przypadku użycia, który wymieniłem w poprzednim artykule. W przypadku każdego stwierdzam, że nie warto używać typu `any`. W ciągu około tygodnia zmieniło się totalnie moje zdanie na ten temat. Jak to możliwe? Dlatego, że **zakładam, że prowadząc bloga, dostarczam wiedzę innym, ale sam też jestem otwarty na naukę.**

Myślę, że każdy z nas w jakimś stopniu żyje w bańce swojego doświadczenia i wiedzy, która może nie być poprawna. Osoby, które chcą dzielić się wiedzą, powinny być gotowe na to, że ich bańka jest wystawiana na opinie innych. Przez te opinie ta bańka może pęknąć.
