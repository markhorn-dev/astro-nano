---
title: "Problem usuwania walidatorów z FormControl"
date: "2020-03-21"
categories: 
  - "angular"
tags: 
  - "angular"
  - "javascript"
  - "reactive-forms"
  - "typescript"
author:
  name: Marek Szkudelski
  picture: '/assets/blog/authors/face.png'
ogImage:
    url: ''
level: "Podstawowy"
description: 'Jednym z problemów Reactive Forms jest usuwanie walidatorów z FormControl. Analizuję ten problem i pokazuję z czego wynika i dlaczego nie jest taki trywialny.'
---

Jeśli tworzyłeś trochę bardziej zaawansowane formularze w Angularze, to zapewne używałeś Reactive Forms, które są do tego celu świetnym narzędziem. Niestety, jeśli musisz wykonać bardziej złożone operacje na grupach, kontrolkach, a tym bardziej walidatorach, to pojawia się parę problemów. Jednym z tych problemów jest usuwanie walidatorów z FormControl. Postaram się przeanalizować ten problem - z czego wynika i dlaczego nie jest taki trywialny.

### Opis problemu

Problem, który chcę poruszyć dotyczy usuwania walidatorów z **FormControl**. Załóżmy, że masz pole kod pocztowy, które ma walidatory sprawdzające jego format i określające, że jest ono wymagane. Najprawdopodobniej użyjemy wtedy **Validators.required** oraz **Validators.pattern**. Jednak pole ma być wymagane, jeśli użytkownik wybierze przesyłkę jako rodzaj dostawy, a nie na przykład odbiór osobisty. W momencie kiedy użytkownik będzie klikał w nasz checkbox albo będzie wybierał w inny sposób opcję dostawy, to musimy manipulować walidatorami. Trzeba usunąć walidator **required** albo go dodać. Jeśli spojrzymy do API Reactive Forms, a dokładniej na interfejs klasy AbstractControl (po której dziedziczą **FormGroup**, **FormControl** oraz **FormArray**), to zobaczymy, że mamy dostępne metody takie jak **setValidators** oraz **clearValidators**.

[Tutaj możecie zobaczyć na przykładzie na czym polega ten problem.](https://stackblitz.com/edit/angular-remove-validator?embed=1&file=src/app/app.component.ts&hideExplorer=1&hideNavigation=1) Widać dokładnie, że musimy użyć dwóch operacji, aby usunąć walidator z kontrolki. Z drugiej strony, żeby dodać usunięty wcześniej walidator musimy dodać na nowo wszystkie bo metoda **setValidators** nadpisuje walidatory. Mamy do dyspozycji metody, które operują tylko na całym zbiorze walidatorów, a nie na pojedyńczych. Idealnie pasowałyby tutaj metody typu **addValidator** oraz **removeValidator**, ale niestety API Reactive Forms nam ich nie dostarcza.

### Struktura walidatorów w Abstract Control

Jeśli chcemy zrozumieć dlaczego to jest zrobione w taki, a nie inny sposób, to musimy trochę zagłębić się w kod źródłowy. Zobaczymy wtedy dlaczego nie jest takie proste, żeby dodać te dwie, na pozór nieskomplikowane metody.

Najczęściej walidatory ustawiamy tworząc instancję klasy, która dziedziczy po **AbstractControl**. Załóżmy, że jest to **FormControl**, podobnie jak w przykładowym projekcie powyżej.

```typescript
const postCodeControl: FormControl = new FormControl(
  null,
  [Validators.required, this.patternValidator],
);
```

[W konstruktorze FormControl](https://github.com/angular/angular/blob/9.0.6/packages/forms/src/model.ts#L998) widzimy, że te walidatory są przekazywane do funkcji **super**, czyli konstruktora klasy-rodzica. Jednak nie są przekazywane w czystej postaci, ponieważ przechodzą przez funkcję [coerceToValidator](https://github.com/angular/angular/blob/9.0.6/packages/forms/src/model.ts#L72) (dla asynchronicznych walidatorów jest bliźniacza funkcja). Spójrzmy na sygnaturę tej funkcji.

```typescript
function coerceToValidator(
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null
): ValidatorFn | null;
```

Przyjmuje ona jeden argument, którym może być **ValidatorFn**, tablica **ValidatorFn** albo walidatory zaszyte w opcjach przekazanych kontrolce (czyli też **ValidatorFn** lub tablica **ValidatorFn**) Natomiast typ zwracany to **ValidatorFn**. Tutaj już powinno coś nam nie pasować... Nawet jeśli przekazujemy do konstruktora tablicę walidatorów, to jest ona przekształcana na pojedyńczy walidator. Oznacza to tyle, że nie ważne jak dużo walidatorów przekażemy kontrolce, to będą one w jakiś sposób przekształcane do jednej funkcji.

Metoda **coerceToValidator** w swoim ciele używa metody **[Validators.compose](https://github.com/angular/angular/blob/9.0.6/packages/forms/src/validators.ts#L414)**, która zwraca anonimową funkcję, która wykonuje po kolei wszystkie walidatory, a potem łączy błędy w jeden obiekt. Tak więc jeśli przekazujemy do kontrolki tablicę walidatorów, to ostatecznie są one konwertowane do jednej funkcji, jak w poniższym snippecie:

```typescript
function(control: AbstractControl) {
  return _mergeErrors(
    _executeValidators(control, presentValidators)
  );
};
```

Jeśli chcielibyśmy bezpośrednio usunąć jeden walidator z kontrolki, to musiałby on mieć jakiś indentyfikator. Walidatory mogłyby być trzymane w obiekcie gdzie klucz byłby nazwą danego walidatora. Wystarczyłoby nawet, że byłyby one trzymane w tablicy, gdzie po indexie moglibyśmy wskazać walidator do usunięcia. To akurat byłoby słabe rozwiązanie, ale lepsze to niż robienie workaround'ów.

Aktualnie Reactive Forms są zrobione w taki sposób, że walidatory są czymś niepodzielnym. Stawia nas to w sytuacji zerojedynkowej. Albo te walidatory nadpiszemy nowym zbiorem, albo je usuniemy.

### Podsumowanie

Niestety po czasie okazuje się, że API Reactive Forms nie jest dopracowane pod pewnymi względami. Na szczęście są plany na zmodernizowanie albo bardziej przepisanie całego modułu. Jeśli chcesz być na bieżąco to możesz śledzić proposal w tym issue na [Githubie](https://github.com/angular/angular/issues/31963), a jeśli chodzi o nasz problem to porusza go ten [komentarz](https://github.com/angular/angular/issues/31963#issuecomment-552889777). Kolejne problemy, które mają takie same źródło można dostrzec jeśli chcemy uzyskać informacje o tym jakie walidatory ma kontrolka. Jest to dokładniej opisane [tutaj](https://github.com/angular/angular/issues/13461). Zachęcam do śledzenia tematu, gdyż możliwe, że nastąpią pozytywne zmiany.
