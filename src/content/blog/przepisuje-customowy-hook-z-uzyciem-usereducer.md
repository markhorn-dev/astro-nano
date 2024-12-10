---
title: "Przepisuję customowy hook z użyciem useReducer"
date: "2021-04-14"
categories:
  - "reactjs"
tags:
  - "javascript"
  - "reactjs"
  - "reactjs-hooks"
serie: 'reactjs-hooks' 
author:
  name: Marek Szkudelski
  picture: '/assets/blog/authors/face.png'
ogImage:
    url: ''
level: "Średniozaawansowany"
published: 'true'
description: 'Przepisuję customowy hook napisany w poprzednich wpisach z serii. 
    Zamiast hooka useState użyję tym razem useReducer i przy okazji opowiem 
    więcej o tym hooku, jak i o samym Reduxie, na którym hook jest wzorowany.'
---

W poprzednich wpisach poznaliśmy hooki `useState` oraz `useEffect`. Zaimplementowaliśmy customowy hook `useFetchData` właśnie za pomocą tych dwóch wbudowanych w Reacta funkcji. **Pytanie, czy dałoby się coś zrobić, żeby ten hook był bardziej przejrzysty i łatwiejszy w utrzymaniu?** Oczywiście zawsze można coś lepiej napisać w kodzie ;) Myślę, że nasz hook jest na tyle prosty, że niekoniecznie wymagałby tego w prawdziwym projekcie (lepsze jest zrobione niż perfekcyjne), ale **na potrzeby edukacyjne spróbujemy go "ulepszyć".**  **Zrobimy to przy pomocy hooka `useReducer`**. Jednak najpierw trochę historii...

## Podstawy Flux'a oraz Redux'a

W 2014 roku Facebook zaproponował podejście do architektury aplikacji, które nazywa się Flux. Określa on, w jaki sposób stan aplikacji powinien być zarządzany przez nas. **Dane powinny "płynąć" w jedną stronę (one direction data flow).** To znaczy, że nie powinniśmy modyfikować stanu bezpośrednio, ale użyć funkcji, która nam ten stan zmieni i rozpropaguje tę zmianę. Mamy tutaj zastosowanie wzorca CQRS, które polega na odseparowaniu pobierania oraz zapisu danych. 

> O samym wzorcu CQRS możecie posłuchać w tym odcinku podcastu DevTalk: [https://devstyle.pl/2019/09/16/devtalk-101-o-cqrs-z-lukaszem-szydlo/](https://devstyle.pl/2019/09/16/devtalk-101-o-cqrs-z-lukaszem-szydlo/)

**Redux natomiast jest implementacją wzorca, jakim jest Flux**. Określa on między innymi dokładny sposób, w jaki powinniśmy operować na stanie. Stan (**State**) jest przechowywane w storze (**Store**), i możemy go modyfikować dzięki akcjom (**Action**). Każda wysłana przez **Dispatcher** akcja przechodzi przez funkcję **Reducer**, która decyduje co z tym stanem zrobić na podstawie danych przekazanych w akcji. W tej funkcji mamy też dostęp do aktualnego stanu. Dość dobrze oddaje to poniższy diagram. 

![/assets/useReducer/Untitled.png](/assets/useReducer/Untitled.png)

> Więcej o samym Flux'ie i Redux'ie możecie przeczytać w tym artykule: [https://typeofweb.com/flux-i-redux-globalny-store-jednokierunkowy-przeplyw-danych/](https://typeofweb.com/flux-i-redux-globalny-store-jednokierunkowy-przeplyw-danych/)

## useReducer

Hook `useReducer` jest trochę uproszczoną wersją **Redux**'a. Przede 
wszystkim nie musi on działać w kontekście stanu całej aplikacji. **Można go użyć w danym komponencie i za jego pomocą zarządzać stanem komponentu**. Z drugiej strony jest dość podobny do `useState`, ale dużo bardziej złożony. *O tym, kiedy używać `useState`, a kiedy `useReducer`, piszę pod koniec artykułu.*

Używając `useReducer` w naszym komponencie musimy najpierw przekazać mu funkcję `reducer`.  Jest to funkcja, która dla podanego stanu oraz akcji zwróci nam zupełnie nowy stan. Funkcja `reducer` jest wywoływany wewnątrz hooka `useReducer` i tam jest przekazywany aktualny stan. Kolejnym argumentem jest stan początkowy. Podobnie, jak w przypadku `useState`, stan może być dowolną wartością - prymitywną lub referencyjną. Trzeci opcjonalny argument to funkcja, która wykona leniwą inicjalizację początkowego stanu - podobnie jak w przypadku `useState` (więcej piszę o tym w poprzednich artykułach).

```tsx
const reducer = (state, action) => ({...state, ...action.newState});
useReducer(reducer, {prop: 123});
```

Co natomiast zwraca ten hook? Jak w przypadku `useState`, mamy tu do czynienia z tablicą zawierającą dokładnie dwa elementy. Pierwszy element to stan, a drugi to też funkcja. Jedyna różnicą jest w tej funkcji. Co prawda też możemy dzięki niej modyfikować stan, ale nie możemy go ustawiać w sposób bezpośredni. **Ta funkcja, najczęściej nazywana `dispatch` (jest to Dispatcher z Reduxa), przyjmuje akcję, która jest obiektem. Ta akcja jest przekazywana do funkcji `reducer`, gdzie decydujemy, co zrobimy z daną akcją.**

```tsx
const reducer = (state, action) => action;
const [state, dispatch] = useReducer(reducer, 123);

dispatch(state.prop * 2);
```

W powyższym przykładzie widzimy, że teoretycznie możemy z tego hooka korzystać bardzo podobnie jak z `useState`. Jednak w takim przypadku robimy sobie bardzo pod górkę, ponieważ musimy deklarować własny `reducer`. Natomiast przy bardziej złożonej logice nabiera to więcej sensu.

```tsx
function reducer(state, action) {
  if(action.type === 'double') {
    return state * 2;
  }
  if(action.type === 'triple') {
    return state * 3;
  }
  if ...
  return state;
}
const [state, dispatch] = useReducer(reducer, 123);

dispatch({type: 'double'});
```

Przekazujemy tutaj tylko typ akcji, więc tak naprawdę akcja mogłaby być po prostu stringiem. Dzięki temu mówimy reducerowi co dokładnie ma wykonać i nie musimy tej logiki określać w komponencie. Dodatkowo dobrą praktyką jest zapisanie sobie typów akcji gdzieś z boku, żeby przypadkiem nie popełnić literówki.

```tsx

const doubleActionType = 'double';
function reducer(state, action) {
  if(action.type === doubleActionType) {
   ...
}
const [state, dispatch] = useReducer(reducer, 123);

dispatch({type: doubleActionType});
```

## Praktyka - refactor useFetchData

W [pierwszym praktycznym artykule](https://blog.szkudelski.dev/posts/useState-od-strony-praktycznej) tej serii stworzyliśmy hook do pobierania danych asynchronicznie z użyciem hooka `useState`. Przypomnijmy sobie, jak na przykład wyglądało tam ustawianie stanu po pomyślnym pobraniu danych.

```tsx
.then(data => setState({data, error: null, status: 'success'}));
```

Jak widzisz, musimy tutaj ustawiać `error` na `null`, pomimo tego, że nie 
powinna nas interesować ta właściwość w tym miejscu (przecież mamy sukces). 
**To jest idealne miejsce, gdzie możemy zastosować `useReducer` i tę logikę wydzielić do osobnej funkcji**. Dzięki temu nie będziemy musieli czyścić właściwości `error` "ręcznie".

```tsx
function reducer(state, action) {
  if(action.type === 'success') {
    return {status: 'success', data: action.payload, error: null};
  }
	if(action.type === 'error') {
    return {status: 'error', data: null, error: action.payload};
  }
	if(action.type === 'loading') {
    return {status: 'loading', data: null, error: null};
  }
}
```

Prawdopodobnie jeśli ktoś pisałby swój pierwszy `reducer`, to jego logika mogłaby wyglądać jak ta powyżej. Jednak jest kilka rzeczy, które moglibyśmy zrobić lepiej. **Pod koniec artykułu zastanowimy się, jak moglibyśmy usprawnić działanie tej funkcji i ulepszyć jej kod.**

Mamy więc napisany `reducer` do naszego hooka, więc wystarczy go teraz użyć i przekazać akcje w odpowiednich momentach. Najpierw wymieńmy `useState` na `useReducer`.

```tsx
const [state, dispatch] = useReducer(reducer, {
  data: null,
  error: null,
  status: "loading",
});
```

Następnie musimy zamienić wywołanie `setState` na wywołanie funkcji `dispatch` z odpowiednią akcją. Dodatkowo przekazujemy odpowiednie dane (odpowiedź z callbacku albo błąd) jako właściwość `payload`. Nazwa jest uniwersalna niezależnie od typu danych, bo na podstawie akcji wiemy co z tymi danymi zrobić.

```tsx
callback()
    .then(data => dispatch({ payload: data, type: "success" }))
    .catch(error => dispatch({ payload: error, type: "error" }));
```

I tak naprawdę to wszystko :) Cała logika jest teraz w reducerze, a my tylko wywołujemy dispatcher z odpowiednim typem akcji.

## Co można zrobić lepiej

Po pierwsze możemy użyć wyrażenia `switch..case` w reducerze, żeby kod być bardziej przejrzysty.

```tsx
function reducer(state, action) {
  switch(action.type) {
    case 'success':
      return {status: 'success', data: action.payload, error: null};
    case 'error':
      return {status: 'error', data: null, error: action.payload};
    case 'loading':
      return {status: 'loading', data: null, error: null};
  }
}
```

Druga sprawa to kontrola nad typami akcji. Z jednej strony, użytkownik tego reducera nie wie jakie akcje może wykonać. Natomiast z drugiej strony, może przekazać jakikolwiek typ i jeśli przekaże błędny, to dowie się o tym z dziwnego błędu w runtime'ie. **Dodajmy więc obiekt określający typy akcji, których będziemy używać w naszym hooku. A jeśli zostanie przekazany zły typ, to rzućmy wyjątek z wymownym komunikatem.**

```tsx
const actionTypes = {
  success: 'success',
  error: 'error',
  loading: 'loading',
}

function reducer(state, action) {
  switch(action.type) {
    case actionTypes.success:
      return {status: 'success', data: action.payload, error: null};
    case actionTypes.error:
      return {status: 'error', data: null, error: action.payload};
    case actionTypes.loading:
      return {status: 'loading', data: null, error: null};
    default:
      throw new Error ('useFetchData hook: incorrect action type passed: ' + action.type);
  }
}
```

> NOTE: Gdybyśmy pisali ten hook w TypeScript, to najprawdopodobniej użylibyśmy tutaj enum'a do określenia typów akcji. Jednak chcę, żeby ta seria artykułów była uniwersalna, dlatego piszę przykład w czystym JavaScript. Pod koniec posta podlinkuję ten przykład napisany z użyciem TypeScripta.

Wtedy przykładowe wysłanie akcji wyglądało tak:

```tsx
dispatch({payload: data, type: actionTypes.success});

dispatch({payload: error, type: actionTypes.error});
```

**Kolejna rzecz, którą moglibyśmy zapisać inaczej, to przekazanie funkcji inicjalizującej stan.** Dzięki temu możemy taką funkcję również wykorzystać w samym reducerze, ustawiając status na "loading". Ponadto samo wywołanie hooka `useReducer` wygląda prościej i bardziej przejrzyście.

```tsx
function init() {
  return {status: 'loading', data: null, error: null};
}

function reducer(state, action) {
  switch(action.type) {
    ...
    case actionTypes.loading:
      return init();
    ...
  }
}

const [state, dispatch] = useReducer(reducer, undefined, init);
```

> [Tutaj](https://stackblitz.com/edit/fetch-data-hook-use-reducer?file=useFetchData.ts) znajdziesz link do przykładu, który tutaj omawiałem. Całość została napisana w TypeScript, więc możesz tam spodziewać się trochę dodatkowego kodu, napisanego, żeby go zaspokoić.

## Podsumowanie

Poznaliśmy hook `useReducer`, który jest świetną alternatywą dla podstawowego hooka `useState`, ale tylko w szczególnych sytuacjach. Jeśli po prostu chcemy mieć stan kontrolowany w naszym komponencie (lub customowym hooku), to wystarczy nam `useState`. **Jeśli natomiast z wyliczaniem kolejnych wartości stanu wiąże się dodatkowa logika, to lepiej wyciągnąć tę logikę do reducera i użyć hooka useReducer**. W ten sposób pozbywamy się logiki z komponentu/hooka, która niekoniecznie musi się tam znajdować. Więcej o tym kiedy używać `useState`, a kiedy `useReducer` możecie poczytać w [artykule Kenta C. Doddsa](https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
