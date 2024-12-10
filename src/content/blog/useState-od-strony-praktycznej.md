---
title: "useState od strony praktycznej"
date: "2021-03-23"
categories: 
  - "reactjs"
tags: 
  - "javascript"
  - "reactjs"
  - "hooks"
serie: 'reactjs-hooks'
author:
    name: Marek Szkudelski
    picture: '/assets/blog/authors/face.png'
ogImage:
  url: ''
level: "Podstawowy"
published: 'true'
description: Od strony praktycznej przyglądam się hookowi useState. Dość dogłębnie analizuję jego działanie, a całość opieram na realnym przykładzie. 
---

W poprzednim [artykule](/posts/wprowadzenie-do-hookow-w-reactjs) omówiłem kontekst, w jakim powstały hooki oraz ich zastosowanie. Teraz chciałbym się skupić na bardziej praktycznych kwestiach. W tym artykule, bazując na rzeczywistym przykładzie z życia wziętym, będę budował własny hook do wykonywania operacji asynchronicznych. Przy okazji opowiem dokładnie o najbardziej podstawowym hooku, czyli `useState`.

## O hooku useState

Najczęściej używanym i najbardziej znanym hookiem w React jest `useState`. **Służy on do określania aktualnego stanu**. W odróżnieniu od stanu w komponentach klasowych tutaj wartością może być każdy typ - prymitywny (np. string lub number) lub referencyjny (np. obiekt). Na początek możemy określić stan początkowy. Można to zrobić przez przekazanie wartości, albo funkcji, która wyliczy początkową wartość dla stanu. W przypadku bardziej złożonych wyliczeń raczej warto użyć funkcji, żeby [nie wyliczać początkowej wartość podczas każdego renderowania komponentu](https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates). Jeśli natomiast nie podamy żadnego parametru do funkcji, to początkowy stan będzie równy `undefined`.

**Hook `useState` zwraca tablicę zawierającą zawsze dwa elementy.** Pierwszy z nich to aktualny stan - może być inny przy rerenderze jeśli go zmieniliśmy w międzyczasie. Drugi element to funkcja przyjmująca nowy stan. Dzięki niej możemy ten stan zmienić. Najczęstszym sposobem użycia tych dwóch elementów jest **destrukturyzacja** zwracanej tablicy. Oczywiście nie jest to konieczne. Możemy również używać tablicy i odwoływać się do stanu oraz funkcji po indeksach tej tablicy. Jednak jest to mało praktyczne.

**Zastosowaniem hooka `useState` jest, to, że React nie zmieni stanu sam z siebie.** Każda stała lub zmienna zadeklarowana w funkcyjnym komponencie będzie deklarowana oraz inicjalizowana przy każdym renderze komponentu. Natomiast stan pozostanie taki jak przy poprzednim renderze, chyba że go zmienimy. Dodatkowo zmiana stanu wymusza, żeby React wyrenderował komponent jeszcze raz. Dość niepewnym sposobem na zmianę stanu jest mutowanie go, czyli zmiana tylko wartości jego właściwości. Nie mamy wtedy pewności, że React zareaguje na takie zmiany. **Dlatego najlepszym sposobem (i jedynym prawidłowym) do zmiany stanu jest użycie funkcji zwróconej z hooka.**

### Stan kontrolowany i pochodny

Kiedyś ktoś poznaje hooki (albo ogólnie ReactJS) i dowiaduje się, że może mieć stan w funkcyjnych komponentach, to często ma tendencję, że używać `useState` do wszystkich danych, które są wyliczane w komponencie. **Zamiast deklarować kolejne kontrolowane stany (Managed States), to możemy użyć mechanizmu, który nazywany jest stanem pochodnym (Derived State).** Polega on na tym, że deklarujemy zmienną lub stałą, która z założenia będzie wyliczna przy każdym renderze komponentu. Bardzo często są to wyliczenia, które są zależne od stanu naszego komponentu. Więc jeśli stan się zmieni, to React odpali jeszcze raz naszą funkcję (komponent funkcyjny) i wyliczy nam wartość na podstawie nowego stanu. 

Spójrzmy na ten prosty przykład. Nie ma potrzeby, żeby zapisywać `fullName` jako kolejny stan kontrolowany. Po pierwsze, jeśli `user` się zmieni, to zmieni się również `fullName` przy rerenderze. Po drugie, w tym przypadku zbudowanie stringa raczej jest mniej obciążającym działaniem niż wywołanie hooka `useState` i pobranie stamtąd wartości.

```tsx
const [user, setUser] = useState(
  { name: 'John', surname: 'Smith' },
);
const fullName = `${user.name} ${user.surname}`;
```

## Praktyka

Aby artykuł nie był zbyt teoretyczny to zbudujemy własny hook na podstawie zdobytej właśnie wiedzy. Jego zadanie będzie polegało na tym, aby pobrać dane z zewnętrznego źródła (np. API) asynchronicznie. Nazwijmy go `useFetchData`. Dodatkowo hook ma zwrócić informacje o statusie, ewentualnym błędzie oraz oczywiście zwrócone dane. Zacznijmy od prostego szkieletu:

```tsx
export const useFetchData = (callback) => {
  return {
    data: null,
    error: null,
    status: "loading"
  };
};
```

Hook dla każdego wywołania (w tym samym komponencie) zwróci nam nowo utworzony obiekt ze statusem 'loading'. Jeśli opieralibyśmy się na wartości tego obiektu w jakiś porównaniach, to szybko wyszłoby, że zawsze mamy do czynienia z nowym obiektem. Jak to zmienić? Użyć hooka `useState`, który zapamięta za nas ten początkowy obiekt i zwróci go przy każdym renderze komponentu.

```tsx
export const useFetchData = (callback) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    status: "loading"
  });

  return state;
};
```

Deklarujemy początkowy stan, a następnie zwracamy go. **Zwróć uwagę na to, że nie zwracamy funkcji `setState`**, ponieważ nie chcemy, żeby ktoś z zewnątrz mieszał nam w kodzie. Spróbujmy teraz wywołać nasz callback.

```tsx
export const useFetchData = (callback) => {
  ...

  callback().then(
    data => setState({ data, error: null, status: "success" }),
  );

  return state;
};
```

Jeśli przyjdą jakieś dane (Promise jest rozwiązany), to ustawiamy nasz `state`. Oznacza to przerenderowanie komponentu, w którym użyliśmy tego hooka. **Po ponownym renderze hook zwraca już stan z danymi z Promise'a oraz status "success".** Co jednak gdy gdzieś po drodze wystąpi błąd? Np. wróci 404 z serwera? Niestety nasza aplikacja przestanie działać. Aby temu zapobiec, musimy obsłużyć ten błąd.

> [Update 26.03.2021] NOTE: Bezpośrednie wywołanie callbacka w hooku jest błędne i nie jest dobrą praktyką w rzeczywistych projektach. W podsumowaniu piszę o tym dlaczego tak jest, a w kolejnym artykule dowiecie się jak naprawić taki kod za pomocą hooka `useEffect`.

```tsx
export const useFetchData = (callback) => {
  ...

  callback()
    .then(
      ...
    ).catch(
      error => setState({ data: null, error, status: "error" }),
    ); 

  return state;
};
```

Dodaliśmy obsługę błędów za pomocą metody `catch`. **Kiedy wystąpi błąd w callbacku, albo w metodzie `then`, przechwycimy błąd i ustawimy stan z obiektem tego wyjątku** i odpowiednim statusem. Tutaj też nastąpi przerenderowanie komponentu i nowy stan z błędem zostanie zwrócony. Ostatecznie nasz hook będzie wyglądał następująco.

```tsx
export const useFetchData = <T>(
  callback: () => Promise<T>
): FetchDataResult<T> => {
  const [state, setState] = useState<FetchDataResult<T>>({
    data: null,
    error: null,
    status: "loading"
  });

  callback()
    .then(data => setState({ data, error: null, status: "success" }))
    .catch(error => setState({ data: null, error, status: "error" }));

  return state;
};
```

> Oczywiście cały przykład w takie formie możecie sobie przetestować [tutaj](https://stackblitz.com/edit/fetch-data-hook-use-state?file=useFetchData.ts).  Zawarłem tam również dwie proste symulacje oraz typy z TypeScripta.

## Podsumowanie

Wygląda na to, że wszystko działa prawidłowo, tak jak sobie założyliśmy. Na początku jest zwracany stan ze statusem `"loading"`, a kiedy `Promise` zwracany przez `callback` zostaje rozwiązany lub odrzucony, to stan zmienia się odpowiednio. 

Zastanówmy się jednak co stanie się jeśli nasz komponent będzie musiał być przerenderowany z innego powodu niż zmiana naszego `state`? Niestety callback zostanie wywołany jeszcze raz, co może spowodować ponowne pobranie danych i niepotrzebne renderowanie dzieci komponentu. Jak temu zapobiec? Najlepszą odpowiedzią na to jest hook `useEffect`, o którym napiszę w kolejnym artykule.
