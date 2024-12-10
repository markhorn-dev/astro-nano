---
title: "O efektach oraz flow hooków w ReactJS"
date: "2021-04-07"
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
level: "Podstawowy"
description: 'Dowiemy się jak zapobiec problemowi zbyt częstego wykonywania kodu 
    w komponencie dzięki hookowi useEffect. Pod koniec 
    wyjaśniam też jak mniej więcej wygląda cykl życia komponentu w kontekście 
    hooków useState oraz useEffect.'
---

W poprzednim wpisie omawiałem hook `useState` i pokazałem prostą oraz dość naiwną implementację customowego hooka `useFetchData`, który ma za zadanie wykonać asychroniczny callback. Pod koniec artykułu doszliśmy do wniosku, że kod nie jest poprawny, ponieważ callback wykona się przy każdym renderze komponentu. W tym wpisie dowiemy się jak temu zapobiec dzięki hookowi `useEffect`. Pod koniec wyjaśnię też jak mniej więcej wygląda cykl życia komponentu w kontekście hooków `useState` oraz `useEffect`.

## Wstęp o hooku useEffect

Hook `useEffect` jest kolejnym ważnym i często używanym hookiem. Przyjmuje on dwa argumenty i jednym z nich jest callback. Drugi argument to lista zależności. **W skrócie można powiedzieć, że `useEffect` wykona przekazany callback po każdym renderze komponentu jeśli którakolwiek z zależności zmieniła swoją wartość względem poprzedniego renderu.** Czym jednak są te zależności i na jakich zasadach są porównywane?

React po każdym renderze komponentu porównuje nowe wartości przekazane w `deps` (drugi argument) ze starym (tymi, które byłe przekazane przy poprzednim renderze), żeby zobaczyć czy się zmieniły. Jeśli jakakolwiek się zmieniła, to wykonuje on callback (funkcja przekazana jako pierwszy argument). Jeśli żadna się nie zmieniła, to nie robi nic podczas tego renderu. 

## Porównywanie zależności

**Do porównania zależności React wykorzystuje natywną funkcję [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), która jest dostępna w JavaScript.** Jeśli zmienimy tylko jakąś właściwość w danym obiekcie, to React nie wyłapie zmiany. Dlatego tak ważna jest **niemutowalność** stanu - React może nie wykonać efektu jeśli mutujemy obiekt. Ponadto nie gwarantuje, że komponent w ogóle zostanie przerenderowany. Jeśli chcemy zmienić jakąś właściwość, to **musimy podmienić (nadpisać) cały obiekt**.

```tsx
const [user] = useState({name: 'John'});

useEffect(() => {
  console.log('user changed!');
}, [user]);

user.name = 'Joe';
```

W powyższym przykładzie efekt wykona się tylko raz przy pierwszym renderze komponentu. Po zmianie imienia użytkownika najprawdopodobniej komponent nie zostanie przyrenderowany (React tego nie gwarantuje), a nawet jeśli, to efekt nie zostanie wykonany, ponieważ wartość nie została zmieniona. `user` wciąż jest referencją do obiektu z początkowego stanu - ta wartość nie uległa zmianie.

> W dużym skrócie metoda **[Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)** jest to operator porównania, ale ulepszony pod pewnymi względami. Porównuje on wartości, które mogą być prymitywne lub referencyjne. Z ciekawostek, ta metoda zwróci nam `true` dla dwóch NaN (Not a Number), kiedy operator porównania zwróci nam `false`.

## Funkcja czyszcząca effect

**Dodatkowo callback, który przyjmuje `useEffect`, może zwracać funkcję. Taka funkcja zostanie wykonana przed każdym kolejnym wywołaniem efektu, a także przy odpinaniu komponentu (component unmount).** Prosty przykład - jeśli podpinamy się do zdarzenia `window resize` w `useEffect` i chcemy to robić przy każdym odpalaniu efektu (np. żeby zdefiniować nowy event listener, który zależy od stanu komponentu), to powinniśmy usuwać poprzednią subskrybcję. Inaczej może to prowadzić do znacznego spowolnienia kodu przez to, że poprzednie subskrybcje (z poprzednich renderów) cały czas istnieją. Wystarczy zwrócić z naszego callbacku kolejny callback, który wykona taką akcję, czyli wypisze się z tego zdarzenia.

```tsx
useEffect(() => {
  const callback = () => ...;  
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}, [depenedency])
```

## Praktyka

Wróćmy do naszego przykładu z hookiem `useFetchData`. **Problem, jaki napotkaliśmy to ponowne odpalanie callbacku przy rerenderze komponentu.** Teraz jak już znamy`useEffect`, to powinniśmy wiedzieć jak sobie z tym poradzić.

```tsx
export const useFetchData = (callback) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    status: "loading"
  });

  useEffect(() => {
    callback()
      .then(data => setState({ data, error: null, status: "success" }))
      .catch(error => setState({ data: null, error, status: "error" }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};
```

Opakowaliśmy całe wywołanie callbacku w `useEffect`. Jak zależności przekazaliśmy pustą tablicę, ponieważ chcemy, że odpalił się on tylko raz. Musimy tutaj wyłączyć zasadę ESLinta (jeśli używamy go, a powinniśmy :) ) `react-hooks/exhaustive-deps`, która mówi o tym, że wszystko, czego używamy w `useEffect`, powinno być w zależnościach. 

**Bez ignorowania tej zasady React domagałby się, żeby callback był przekazany jako zależność.** Jeśli dodalibyśmy go jako zależność, to warto byłoby również ustawiać status `"loading"` jeśli efekt będzie odpalany przez zmianę callbacku. **To natomiast będzie powodować nieskończoną pętlę renderowań komponentu.** Zmiana callbacku będzie odpalała efekt, a on będzie ustawiał stan, co będzie powodować rerender komponentu. W komponencie będzie deklarowany nowy callback (chyba że deklarujemy go poza komponentem) podczas każdego renderu, a to znowu będzie powodowało odpalenie efektu.

1. Rerender komponentu.
2. Utworzenie nowego callbacku (jest deklarowany w komponencie)
3. Odpalenie efektu.
4. Ustawienie stanu hooka (ze statusem loading)
5. Rerender komponentu
6. ... i tak w kółko :)

**Innym ze sposobów na poradzenie sobie z tym problemem jest przeniesienie deklaracji callbacka poza ciało komponentu.** Tak naprawdę efekt będzie wtedy taki sam, ponieważ callback wywoła się tylko raz. Ponadto może nie być to wygodne. Callback może polegać na przykład na stanie komponentu, albo na propsach.

> Jest lepszy sposób, żeby sobie poradzić z nieskończoną pętlą. Możemy użyć 
> hooka `useCallback`, ale na niego jeszcze przyjdzie czas w naszej serii ;)

## Co zrobić lepiej

Czasami może się zdarzyć, że w callbacku przekazanym do naszego hooka, będziemy polegali na jakiejś zewnętrznej zależności. **W takiej sytuacji powinniśmy przekazać listę zależność do `useEffect`.**

```tsx
export const useFetchData = (callback, deps = []) => {
  ...

  useEffect(() => {
    setState({
      data: null,
      error: null,
      status: "loading"
    });

    callback()...
  }, [...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  ...
};
```

W takim wypadku musimy wyzerować stan hooka oraz ustawić status ładowanie, żeby na przykład pokazać spinner podczas przeładowania danych. Jeśli zerkniesz do przykładu [tutaj](https://stackblitz.com/edit/fetch-data-hook-use-effect?file=Hello.tsx), to zobaczyć, że pierwszy callback wywołuje się jeszcze raz, a status ustawia się na "loading", jeśli zmienimy stan `name`.

> Finalna (na ten moment) wersja naszego hooka `useFetchData` będzie wyglądała tak jak w [tym przykładzie](https://stackblitz.com/edit/fetch-data-hook-use-effect?file=useFetchData.ts). Jak zwykle dodałem typy z TypeScript'a.

## Jak działają hooki, czyli o flow

To jak dokładnie działają hooki może nie być oczywiste patrząc na kod. Szczególnie kiedy ktoś zaczyna swoją przygodę z hookami, to raczej nie zdaje sobie sprawy z tego, kiedy co się wykonuje. Nie do końca jest też to potrzebne do pisania poprawnego kodu, ale przy bardziej złożonych przypadkach warto mieć tę wiedzę. Przydaje się ona do debugowania bardziej złożonych problemów. Spójrzmy na ten diagram.

![Diagram przedstawiający flow hooków](/assets/useEffect/Group_10.png)

> Źródło: [https://github.com/donavon/hook-flow](https://github.com/donavon/hook-flow). Od razu zaznaczę, że nie omawialiśmy (być może jeszcze) hooka `useLayoutEffect`, więc wyszarzyłem ten fragment.

Mamy trzy etapy życia komponentu: **mount** (przypięcie do DOMu), **update** (aktualizacja) oraz **unmount** (odpięcie od DOMu). W poziomie widzimy, co po kolei się dzieje. W przypadku zamontowania komponentu na samym początku odpalają się funkcje, które przekazaliśmy do `useState` w celu odciążenia głównego wątku. Następnie nasz komponent jest renderowany, czyli React tworzy i zwraca React Elements w strukturze określonej w JSX. Dopiero wtedy React aktualizuje DOM, czyli komponent jest gotowy do pokazania w przeglądarce. Jak już wspomniałem, nie omawiałem hook’a `useLayoutEffect`, więc ominę ten fragment. Następnie przeglądarka aktualizuje widok i nasz komponent tam się ukazuje. Na sam koniec są odpalane efekty przekazane do hooków `useEffect` w komponencie. 

Jeśli tam (w jakimś efekcie) zostanie zmieniony stan komponent (albo z innego powodu nastąpi rerender komponentu), to zaczynamy wszystko od początku. Tym razem jednak przebiega to trochę inaczej, bo nie uruchamiają się leniwe inicjalizatory. Stan początkowy został już dostarczony przy pierwszym renderze, więc teraz nie ma potrzeby wyliczać tego stanu. Właśnie dlatego przekazanie funkcji do `useState` jest zaletą przy bardziej obciążających wyliczenia - stan nie wylicza się przy każdym renderze. Komponent od razu jest renderowany, a potem dzieje się mniej więcej to samo z tą różnicą, że efekty są czyszczone (wcześniej nie było takiej potrzeby). Następnie są kolejny raz odpalane, jeśli oczywiście zmieniły się ich zależności.

Najprostszy etap, to odpięcie komponentu. Tutaj zachodzi tylko wyczyszczenie efektów. Jeśli komponent będzie podpięty znowu, to wykonuje się wszystko z kolumny **mount**.

Jak widzimy, efekty wykonują się zawsze po podpięciu i aktualizacji komponentu. Dodatkowo dają możliwość wykonania akcji czyszczącej na odpinanie komponentu. Pewnie już zauważyłeś, że niejako zastępują one metody cyklu życia komponentu znane z klasowych komponentów: `componentDidMount`, `componentDidUpdate` oraz `componentWillUnmount`. Ponadto są o tyle lepsze, że jesteśmy w stanie, dzięki zależnościom, dokładnie określić kiedy, który efekt jest uruchamiany. Uważam, że jest duża zaleta, a więcej o tym piszę [w pierwszym wpisie](https://blog.szkudelski.dev/posts/wprowadzenie-do-hookow-w-reactjs) z tej serii.

## Podsumowanie

Nasza implementacja hooka `useFetchData` wygląda już całkiem przyzwoicie i nadaje się do użycia w prostych przypadkach. **Jednak nasza logika trochę się skomplikowała. Jest parę linijek kodu, które moglibyśmy zredukować.** Np. zamiast przekazywać `null` w polach `data` oraz `error` podczas ustawiania statusu na `loading`, mogłyby te pola zerować się automatycznie (zawsze kiedy zmienimy status na `loading`). **Jak wynieść taką logikę poza nasz hook i tym samym uczynić hook bardziej przejrzystym?** **Odpowiedzią na to jest wbudowany hook `useReducer`**, o którym będę pisał w kolejnym artykule :)
