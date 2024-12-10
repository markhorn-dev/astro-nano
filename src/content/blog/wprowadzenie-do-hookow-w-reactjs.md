---
title: "Wprowadzenie do Hooków w ReactJS"
date: "2021-03-17"
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
description: Postanowiłem podsumować swoją wiedzę na temat hooków. W pierwszym artykule serii przyglądam się historii jak stała za wprowadzeniem tego feature'a.
---

Hooki to stosunkowo nowy feature w ReactJS. Niedawno minęły dwa lata od ich wprowadzenia przez zespół rozwijający ten framework. Było to dość rewolucyjne posunięcie, ponieważ zupełnie zmieniło postrzeganie komponentów funkcyjnych. Kiedy jakiś czas temu zmieniałem projekt z Angularowego na Reactowy, to właśnie hooki były tym, co wprowadzało najwięcej zamieszania w moim zrozumieniu, jak działa React. Postanowiłem podsumować swoją wiedzę na ich temat. Jeśli zastanawiasz się jaka historia kryje się za hasłem, jakim są hooki i chcesz poznać podstawowe z nich, to zapraszam.

> Jest to pierwszy artykuł z [serii o hookach](/series/reactjs-hooks). Jeśli interesuje Cię bardziej praktyczna wiedza, to pojawi się ona w kolejnych artykułach! 

## Po co te hooki? Krótka historia o stanie

Przed wprowadzaniem hooków stan komponentu mógł istnieć tylko i wyłącznie w komponentach klasowych. Komponenty funkcyjne były tylko głupimi, bezstanowymi funkcjami, które zwracały określoną strukturę dla podanego wejścia. Zmuszało to programistów do używania klas wszędzie tam, gdzie chcieli dodać stan do komponentu. Jak twierdzą twórcy Reacta, była to duża bariera dla osób, które zaczynały swoją przygodę z JavaScriptem, Reactem, albo po prostu z programowaniem. Ja uważam, że nie jest takie oczywiste.

### Bałagan związany ze stanem

W samych komponentach stanowych często pojawiał się bałagan implementacyjny, ponieważ był tylko jeden obiekt stanu komponentu. Nie było żadnej możliwości odseparowania danych, które nie są ze sobą powiązane. Co za tym idzie, często niepowiązana ze sobą logika jest umieszczana w jednej metodzie. Przykładem jest, chociażby metoda `componentDidMount`, która ma reagować na pierwszy render komponentu. Efektem jest trzymanie w jednym obiekcie niepowiązanych danych i operacje na nich w tej samej metodzie. Przy bardziej złożonych komponentach może to prowadzić to niezbyt czytelnego kodu.

### Współdzielona logika

Kolejnym problemem jest to, że w klasowych komponentach stan musi być właściwością klasy komponentu, więc nie ma możliwości, żeby stan oraz logikę z nim związaną w oczywisty sposób wynieść gdzieś poza komponent i użyć w innym miejscu. Oznacza to, że trzeba kombinować w inny sposób z reużywaniem logiki, Jednym z nich jest tworzenie [Higher Order Component](https://reactjs.org/docs/higher-order-components.html), czyli funkcji, która zawiera logikę, którą chcemy użyć w wielu miejscach. HOC przyjmuje jako argument jakiś komponent, opakowuje go dodatkową logiką i zwraca nowy komponent. Innym podejściem do reużywania logik było tzw. [render props](https://reactjs.org/docs/render-props.html). Komponent przyjmował callback, który miał za zadanie wyrenderować jakąś część tego komponentu. Jako parametr callback mógł przyjmować jakieś dane potrzebne do wyrenderowania tej części komponentu. Mogło to służyć w przypadku, kiedy chcemy wyrenderować `children` w komponencie, ale musimy je w jakiś sposób sparametryzować z poziomu rodzica.

Podsumowując, można powiedzieć, że hooki w Reakcie rozwiązały przynajmniej dwa problemy. Z jednej strony dały możliwość na przechowywanie stanu w komponentach funkcyjnych. Natomiast z drugiej strony dały dużo większe możliwości na reużywanie stanowej logiki, dzięki czemu kod jest czystszy i czytelniejszy. A w jaki sposób hooki to robią? Na to pytanie zaraz znajdę odpowiedź. Jednak najpierw przyjrzyjmy się dokładnie jakie zastosowanie mają hooki.

## Jakie zastosowanie mają hooki?

Głównym zastosowaniem hooków jest to, o czym już wspomniałem. Przede wszystkim pozwalają nam na tworzenie stanowych komponentów funkcyjnych. Dzięki temu nie musimy już być skazani na komponenty klasowe, jeśli chcemy, żeby miały one stan. Mamy wybór pomiędzy typowo funkcyjnym, deklaratywnym podejściem, a podejściem obiektowym, pisząc aplikację w ReactJS.

Kolejną rzeczą jest myślenie o tym kiedy zachodzą zmiany w komponencie. W przypadku stanu w klasach myślimy kiedy w cyklu życia komponentu ma się coś zadziać. W przypadku hooków myślimy o tym, kiedy ma się coś zadziać w ścisłym połączeniu ze zmianami w stanie komponentu. Określona logika jest ściśle powiązana ze zmianami w stanie, który wskażemy. Będę to bardziej szczegółowo tłumaczy pod koniec, kiedy będę omawiał, jak wygląda flow renderowania i odświeżania komponentu w kontekście hooków. Świetnie opisuje to poniższy cytat.

> S*top thinking about "when things should happen in the lifecycle of the component" (which doesn't matter all that much) and more about "when things should happen in relation to state changes" (which matters much more) ~ [Kent C. Dodds](https://kentcdodds.com/blog/react-hooks-pitfalls)*

Na koniec warto też wspomnieć, że są świetnym narzędziem, żeby reużywać logikę stanową. Dzięki temu, że hooki są ściśle powiązane z danym stanem, a nie z cyklem życia komponentu, to możemy wyciągnąć ten stan oraz hooki z nim powiązane poza komponent. Oznacza to możliwość tworzenia swoich własnych hooków właśnie po to, by tę samą logikę użyć w wielu miejscach w aplikacji przez proste wywołanie funkcji.

## Zasady hooków

Twórcy Reacta nie dali nam wolnej ręki do używania hooków, ale określili parę podstawowych zasad z nimi związanych. Przyjrzyjmy się teraz jakie to zasady i z czego wynikają.

### Nie wywołuj hooków w pętlach, blokach warunkowych lub zagnieżdżonych funkcjach

Spójrzmy na przykład hooka do trzymania stanu komponentu. React wie, które wywołanie `useState` odpowiada konkretnemu stanowi, dzięki kolejności, w jakiej hooki są wywoływane. Spójrzmy na ten przykład, zakładając, że można złamać powyższą zasadę.

```tsx
useState("1"); // First useState call -> value "1"
if(true) {
  useState("2"); // Second useState call -> value "2"
}
useState("3"); // Third useState call -> value "3"
```

React wie, że wartość "2" odnosi się do drugiego wywołania hooka `useState` w tym komponencie. Jeśli warunek przy kolejnym renderze zmieni się na `false`, to React będzie twierdził, że wartość "2" odnosi się do miejsca, gdzie powinna być wartość "3". Wszystko przez to, że "drugie" wywołanie hooka tak naprawdę nie miało miejsca w tym renderze. W takiej sytuacji React nie będzie wiedział, że dane wywołanie `useState` odnosi się do stanu, który miał już zapisany przy poprzednim renderze.

### Nie wywołuj hooków w zwykłych funkcjach JavaScriptowych

Hooki są narzędziem przeznaczonym dla komponentów funkcyjnych. Wynika z tego, że możemy hooki wywoływać tylko i wyłącznie w takich komponentach - bezpośrednio albo pośrednio. Pośrednio można to zrobić przez zdefiniowanie własnego hooka, który zawiera wbudowane w Reacta hooki. O tym będę pisał w moich kolejnych artykuła, gdzie pokaże hooki `useState` oraz `useEffect` na konkretnym przykładzie. Na ich podstawie zbuduję swój własny hook. 

## Podsumowanie

W tym artykule omówiliśmy sobie historię, jaka idzie za hookami. Podsumujmy sobie, co nam one dają i jakie problemu rozwiązują:

1. Wcześniej stan był tylko w komponentach klasowych. Dzięki hookom możemy ten stan mieć również w komponentach funkcyjnych.
2. Hooki pozwalają na reużywanie logiki związanej ze stanem.
3. Dzięki nim możemy skupiać się na cyklu życia danego stanu zamiast na cyklu życiu komponentu.

Mam nadzieję, że wystarczająco nakreśliłem Ci, czym są hooki, skąd się wzięły i co dzięki nim zyskujemy. W kolejnych artykułach z tej serii zajmę się bardziej praktycznym zagadnieniom i spojrzę na to, jak działają hooki wbudowane w ReactJS. 

