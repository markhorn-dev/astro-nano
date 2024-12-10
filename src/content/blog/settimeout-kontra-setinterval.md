---
title: "setTimeout kontra setInterval - wątpliwości rozwiane"
date: "2021-04-23"
categories:
  - "javascript"
tags:
  - "javascript"
  - "setTimeout"
  - "setInterval"
  - "browser-api"
author:
  name: Marek Szkudelski
  picture: '/assets/blog/authors/face.png'
ogImage:
    url: ''
level: "Średniozaawansowany"
published: 'false'
description: ''
---
Kiedy zaczynałem swoją karierę jako programista Frontend, to ktoś powiedział mi, żeby nie stosować `setInterval`, a zamiast tego użyć `setTimeout`, ale rekurencyjnie. Argumentem było to, że ta pierwsza funkcja blokuje główny wątek aplikacji. W mojej głowie od razu powstało wyobrażenie, że cała aplikacja stoi i nie jest interaktywna przez cały czas kiedy `setInterval` liczy czas i wykonuje callback. Bardzo mnie to zraziło do tej funkcji, bo przecież było to dla mnie zachowanie nie do przyjęcia.
Z biegiem czasu jedna dowiedziałem się, że źle zrozumiałem tę osobę, albo ona źle się wyraziła. Już jakiś czas temu postanowiłem zbadać, co ta osoba mogła mieć na myśli, bo ewidentnie był to duży skrót myślowy. Funkcja `setInterval` jest asynchroniczna tak jak `setTimeout`. Co jednak znaczy ta asynchroniczność i jakie są różnice pomiędzy `setInterval` i `setTimeout` wykonywanym rekurencyjnie? Na te pytania znajdę odpowiedź w tym artykule.

## Rekurencyjny setTimeout, czyli jaki?
Rozważmy następujący kod. Chcemy pokazać console.loga raz na sekundę:
```javascript
setTimeout(() => console.log('log'), 1000);
```
Powyższy kod poczeka 1000 milisekundy, czyli jedną sekundę, a następnie wykona callback i pojawi się log w konsoli. Na tym koniec. Wspomniałem już, że funkcja ta jest asynchroniczna. Oznacza to tyle, że w czasie oczekiwania na wywołanie callbacka, przeglądarka może wykonywać kod. Główny wątek aplikacji nie jest blokowany w żaden sposób. Zostanie on przejęty dopiero w momencie wywołania callbacka, czyli po mniej więcej sekundzie.

Aby wywoływać ten callback co sekundę, ale więcej niż raz, trzeba opakować `setTimeout` w funkcję, którą będziemy wywoływać co sekundę.
```javascript
function logRecursively() {
  setTimeout(() => { 
    console.log('log');
    logRecursively();
  }, 1000);
}

logRecursively();
```
Jak wywołamy funkcję, to ustawi się timeout, a po upłynięciu wskazanego czasu (1000ms = 1s) wywoła się callback. W nim ustawi się znowu ten sam timeout. Czy to oznacza, że będziemy widzieli loga w konsoli dokładnie co 1000ms? Odpowiedź brzmi: nie.
Dla uproszczenia załóżmy, że w naszym kodzie (pod kątem czasy wykonania) rozpatrujemy tylko wywołania funkcji jako osobne instrukcje i trwają one po 1ms. Mija nasze 1000ms i silnik JavaScript wywołuje nasz callback (1ms), a następnie `console.log` (1ms) oraz `logRecursively` (1ms). W tej funkcji zostaje wywołany `setTimeout` (1ms) i znowu zaczyna się odliczanie 1000ms podanych jako drugi parametr. Tak więc od pierwszego ustawienia timeout'a mija 1004ms. Oznacza to, że callback drugi raz wywoła się po 2004ms, a kolejny po 3008ms.

Już pewnie widzisz, że nie zupełnie osiągnęliśmy nasz cel. Nasz callback nie odpala się co sekundę, ale trochę więcej. Przy prostych operacjach to nie ma raczej zbyt dużego znaczenia, ale jeśli wywołanie callbacka trwałoby np. 100ms, to już ma duże znaczenie, a po dziesiątym razie będziemy mieli dwukrotne opóźnienie.

Podsumowując, można powiedzieć, że `setTimeout` wykona callback po upływie minimum 1000ms.
Widzisz już prawidłowe rozwiązanie z użyciem funkcji `setTimeout`? Na razie poczekaj jeszcze chwilę, bo pokażę jak sprawa się ma z `setInterval`.

## Ustawianie interwałów
Funkcja `setInterval` działa nieco inaczej, bo zamiast dodać czas wykonywania callbacku do interwału, to on go odejmuje. W naszym przykładzie pierwsze wywołanie będzie po 1000ms, ale następne już po 996ms. W dokumentacji natomiast można wyczytać, że `setInterval` gwarantuje, że kod zostanie wykonany przed upływem podanego czasu. Natomiast `setTimeout` gwarantuje, że upłynie przynajmniej podany czas.

> Zachęcam Cię, żebyś zobaczył w konsoli w tym przykładzie, jak to rzeczywiście wygląda: https://stackblitz.com/edit/settimeout-setinterval?file=index.js (spójrz szczególnie na pierwszy blok kodu)

Ustawiamy tutaj interwał na 1000ms. W każdym callbacku czekamy na wywołanie tajemniczej funkcji `block`, która karze wstrzymać kod na 500ms (tylko w kontekście tego callbacka, ponieważ `block` to asynchroniczna funkcja). Pierwsze wywołanie jest faktycznie po około 1s, ale następne już nie. Interwał jest wyliczany na podstawie czasu wykonywania kodu poprzedniego callbacku. W rzeczywistości widzimy, że interwały trwają po niecałe 500ms. Jest to spowodowane tym, że `setInterval` chce za wszelką cenę zmieścić się w interwale, czyli 1000ms. Po pierwszym wywołaniu callbacku wie już, ile czasu będzie on trwał i ten czas odejmuje on sobie od czasu czekania na kolejne wywołanie. 

Podsumujmy: `setInterval` gwarantuje, że callback zostanie **wykonany** przynajmniej raz w ciągu trwania jednego cyklu. Pytanie, czy jesteś w stanie osiągnąć to za pomocą setTimeout?

## setTimeout w trybie interwałowym
Powyżej ustawialiśmy kolejny timeout dopiero na końcu callbacka. W przypadku wywołania funkcji `block` może to oznaczać duże opóźnienie. Jeśli chcielibyśmy zbliżyć zachowanie setTimeouta do interwału, to moglibyśmy ustawić kolejny timeout na samym początku callbacka. Jednak wciąż ponosimy koszt czasowy wywołania rekurencyjnie funkcji oraz setTimeout. Wychodzi mniej więcej na to, że tracimy około 1 milisekundę na każde wywołanie. Pytanie, czy to jest w ogóle jakikolwiek koszt, skoro tracimy około 1ms?
```javascript
function logRecursively() {
  setTimeout(() => { 
    logRecursively();
    console.log('log');
  }, 1000);
}

logRecursively();
```

## Zadanie dłuższe niż interwał
Przeanalizowaliśmy już najpopularniejsze sposoby na cykliczne wykonywanie kodu w JavaScript. Zastanówmy się teraz nad skrajnym przypadkiem Co stanie się jeśli callback będzie się wykonywał dłużej, niż trwa cykl interwału ustawionego przez `setInterval`?


## Dobra praktyka

Chained-Timeout gives a guaranteed slot of free time to the browser; Interval tries to ensure the function it is running executes as close as possible to its scheduled times, at the expense of browser UI availability.

setTimeout - łatwiej ustalić "warunek końcowy"

## Realny przykład
pingowanie api - odświeżanie danych w tabeli


https://stackoverflow.com/questions/729921/settimeout-or-setinterval
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjEzNDkyMDgyMywtMzg0NDAxMTY0LC0xMT
IxMzEzNDU2LDEzMjE4Mjk5MzYsLTkxNzAzODY1OSwtOTc2ODA3
OTMxLDEwMTk1OTc5OTgsLTE3MjY2NjMwMDcsNzA5MTQwMDgxLC
0xNDk3MzUxMzQsLTE1ODkwMTAyMDYsLTQ0MjkyNzIyOSwxMDk3
NTk5OTY4LDIwMjM2MDQ3ODYsLTIwMjE2NDAyNiwtMTg2NjgwMj
E3MiwtMzY0MzYxMjczLDIwMTUyODMzNDcsLTE5MDY5ODEzMiwx
MTY0NjcxNzE1XX0=
-->