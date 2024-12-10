---
title: "Jak skutecznie i efektywnie rozwijam oprogramowanie?"
date: "2022-12-05"
categories: 
  - "self-develop"
tags: 
  - "rozwój"
  - "praca zespołowa"
  - "self-develop"
author:
   name: Marek Szkudelski
   picture: '/assets/blog/authors/face.png'
ogImage:
 url: ''
level: ""
published: 'true'
description: 'Rozwijać oprogramowanie można na wiele sposobów. Każdy programista ma pewnie swój własny styl, którym pisze kod. Przez ostatnie lata udało mi się wypracować swój własny, który przynosi dobre efekty jeśli dobrze do niego podejdę.'
---
Rozwijać oprogramowanie można na wiele sposobów. Każdy programista ma pewnie swój własny styl, którym pisze kod. Przez ostatnie lata udało mi się wypracować swój własny, który przynosi dobre efekty jeśli dobrze do niego podejdę. Pomaga mi on efektywnie dostarczać oprogramowanie dobrej jakości.

# Wszystko jest PoC'em

Tworzę najpierw proof of concept tego co mam zaimplementować. Jest to najprostsza ścieżka, taki happy path, bez żadnych wodostrysków, obsługi błędów lub innych skrajnych przypadków. Sprawdzam, czy mój ogólny pomysł na to zadanie się sprawdzi.

Jeśli robiłbym wszystko skrupulatnie od początku, to w połowie mógłbym się zorientować, że moje rozwiązanie jest jednak nie najlepsze. Wtedy mam dwie opcje. Mógłbym zaorać wszystko i zacząć od nowa, albo brnąć dalej w słabe rozwiązanie, co może się potem bardzo zemścić.

Podejście szczególnie sprawdza się przy większych zadaniach z bardziej złożoną logiką. Zaczynając od samej koncepcji jestem w stanie bardzo szybko zweryfikować kilka rzeczy:

to czy dobrze rozumiem ogólne założenia danego zadania. Jest to dużo ważniejsze niż użycie odpowiedniego koloru albo wielkości czcionki.

to czy moje rozwiązanie jest skuteczne. Czasem może się okazać, że napiszemy kawał kodu, ale nasze rozwiązanie ma ograniczenia, które nie pozwalają albo bardzo utrudniają realizację zadania.

# Nie dbam o szczegóły

Podczas tworzenia szkieletu (proof of concept) zazwyczaj nie dbam o jakość kodu. Jeśli coś mi nie pasuje to zostawiam i poprawiam potem. Nie przejmuję się zostawionymi log'ami w konsoli, bo wiem, że będę miał potem czas, żeby to posprzątać.

Tworzę często dużo i złożone funkcję, które rozumiem teraz, ale pewnie nie zrozumiałbym z łatwością za miesiąc. Podczas implementacji jeszcze pamiętam do czego służą i co robią, więc ich złożoność mi zupełnie nie przeszkadza. Nie ma potrzeby, że już teraz rozbijać te funkcje na mniejsze.

Rzeczy, którymi się nie przejmuje:

⚫️ złożone funkcje

⚫️ zduplikowany kod

⚫️ logi w konsoli, komentarze

⚫️ źle nazwane komponent, zmienne, funkcje

⚫️ stylowanie i layout (po stronie frontendu)

# TODO'sy, wszędzie TODO'sy

Kiedy widzę jakieś niedociągnięcia w kodzie, ale coś co wiem, że będę musiał dodać w przyszłości, to dodaję sobie prosty komentarz TODO. Zazwyczaj ma on taką formę:

> // TODO handle error

Czas na rozwiązywanie takich TODO'sów rezerwuję sobie zawsze na sam koniec, kiedy już moje zadanie działa i jestem pewien, że rozwiązanie jest poprawne.

# Testy przed czyszczeniem kodu

Bardzo ważny etap, żeby dowieźć wysokiej jakości oprogramowanie. Testuję przed refactorem i dopracowaniem kodu, żeby mieć pewność, że późniejsze zmiany się powiodą.

Takie podejście daje możliwość robienia dość zaawansowanego refactoru z dość małym prawdopodobieństwem na zepsucie feature'a.

Jeśli ominąłbym ten etap i zaczął dopracowywać kod, wyciągać funkcje, usuwać duplikacje, to bardzo prawdopodobne, że coś by się posypało. Wtedy ręcznie musiałbym to sprawdzać, a tak testy mi mówią dokładnie co jest nie tak.

# Przechodzenie przez każde TODO w dodanym kodzie

Na tym etapie przeglądam każde TODO dodane w ramach tego zadania i decyduje czy je wykonać.

Jeśli nie chce tego z jakiegoś powodu robić teraz to najczęściej określam kiedy ono będzie zrobione.

Jeśli ma być zrobione na przykład w ramach jakiegoś zadania, które wkrótce będziemy realizować to zostawiam w komentarzu w kodzie taką informacje (link do zadania). Najlepiej dodać też info o tym w samym zadaniu jeśli jeszcze tego nie zawiera.

Jeśli TODO może być wykonane kiedyś, ale czas nie jest znany to wtedy dodaję zadanie do backlogu. Wtedy też dodaję link do zadania w komentarzu.

# Dalszy refactor

Zawsze przeglądam cały kod zanim wystawię pull request'a do code review. Przynajmniej dwa razy. Po pierwsze, chcę dowieźć kod dobrej jakości, bez liczenia na to, że ktoś wyłapie moje błędy. Po drugie, chcę zaoszczędzić czas osoby, która będzie mi robiła code review.

Dużo lepiej sprawdza się dobrej jakości kod, skupiając się na ogólnej koncepcji rozwiązania, niż zły kod, gdzie trzeba zwracać uwagę na najmniejszy szczegół, bo jego jakość pozostawia wiele do czynienia.

# Podsumowanie

W skrócie mój proces wygląda tak:

⚫️ Pisanie Proof of Concept - szkieletu zadania/funkcjonalności.

⚫️ Dodanie komentarzy z TODO.

⚫️ Pisanie testów - już po zakończonej implementacji.

⚫️ Refactor. Ulepszanie kodu, dociągnięcia, na które wcześniej nie poświęcałem czasu.
