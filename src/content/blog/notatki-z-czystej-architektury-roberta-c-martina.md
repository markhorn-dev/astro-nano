---
title: "Notatki z \"Czystej architektury\" Roberta C. Martina"
date: "2022-08-30"
categories: 
  - "architecture"
tags: 
  - "architecture"
  - "self-develop"
  - "design-patterns"
  - "wzorce-projektowe"
author:
   name: Marek Szkudelski
   picture: '/assets/blog/authors/face.png'
ogImage:
 url: ''
level: ""
published: 'true'
description: 'Postanowiłem zebrać przynajmniej część notatek z "Czystej architektury" Roberta C. Martina i podzieli się z wami. Ta książka dała mi bardzo dużo do myślenia. Pomogła mi też w moim rozwoju zawodowym poprzez szersze spojrzenie na system, który aktualnie rozwijam.'
---

# Wstęp

Postanowiłem zebrać przynajmniej część notatek z "Czystej architektury" Roberta C. Martina i podzieli się z wami. Ta książka dała mi bardzo dużo do myślenia. Pomogła mi też w moim rozwoju zawodowym poprzez szersze spojrzenie na system, który aktualnie rozwijam.

# Single Responsibility Principle

Co ciekawe, pierwsza myśl jak mi została to poprawne spojrzenia na zasady SOLID. Są one ściśle związane z programowaniem, a nie samą architekturą, ale niektóre z nich mają też swoje przełożenie na architekturę oprogramowania.

SOLID - pewnie każdy z programistów słyszał kiedyś ten akronim. Jest to zbiór ogólnych zasad, które można wykorzystać jako dobre praktyki w programowanie (szczególnie obiektowym).

Pierwsza zasada jest chyba najbardziej popularna, ale moim zdaniem też najczęściej źle rozumiana. SRP, czyli Single Responsibility Principle. Zasada pojedynczej odpowiedzialności. Najczęściej jest ona rozumiana jako "klasa (lub funkcja) może robić tylko jedną rzecz". Jeśli tak zdefiniujemy tę zasadę, to na przykład nie mogłaby nigdy powstać klasa Calculator. Musielibyśmy stworzyć klasy CalculateAdd, CalculateMultiply...

Nie zupełnie chodzi o to, żeby dana na przykład klasa, robiła tylko jedną rzecz i nic poza tym. Ta zasada inaczej brzmi "istnieje tylko jeden powód do zmiany" danej klasy. Oznacza to, że klasa nie powinna się zmieniać np. pod wpływem nowych wymagań z dwóch różnych działów w firmie.

Robert C. Martin wprowadza w swojej książce pojęcie aktorów. Ci aktorzy są grupami użytkowników, którzy w różny sposób oddziałują na system. SRP mówi o tym, że tylko jeden aktor może wymusić zmianę na danym elemencie w systemie np. klasie.

Teraz mógłbyś sobie pomyśleć: "Ok... fajnie to brzmi, ale jak to zastosować w praktyce?"

Przez ostatni czas pracowałem nad systemem dla szkoły wyższej. Załóżmy, że zarówno dziekanat, jak i dział finansowy potrzebuje mieć listę wszystkich studentów, ale z możliwością wykonywania różnych akcji na tych studentach. Możemy stworzyć jedną listę z warunkiem, który udostępni różne akcje i po prostu wyświetlić tę listę w dwóch miejscach.

Teraz musimy odpowiedzieć sobie na pytanie "Ilu aktorów może wymusić zmianę na tym komponencie?". Odpowiedź brzmi: dwóch, więc łamiemy SRP. Dobrą praktyką w tym momencie będzie stworzenie dwóch osobnych list. Pomimo, że będą one praktycznie identyczne.

Czy tę samą zasadę można zastosować na wyższym poziomie, na poziomie architektury? Tak, można 😉

Robert C. Martin w swojej książce pisze o zasadzie Common Closure Principle (CCP):

> "W ramach komponentu zgromadź te klasy, które zmieniają się z tego samego powodu"

## Komponent

Komponent - możemy przyjąć, że jest to szeroko rozumiany moduł naszego systemu/aplikacji. Dokładna definicja zależy od architektury. W przypadku systemy frontendowego może to być np. microfrontend, odrębna biblioteka, widok, który ładujemy leniwie (lazy loading).

## CCP, czyli SRP dla architektury

CCP jest zasadą SRP, ale przełożoną na komponenty. Zasada ogranicza się do grupowania elementów, które zmieniają się z tych samych powodów. Jednocześnie chcemy oddzielać rzeczy (przenosić do różnych komponentów), które zmieniają się z różnych powodów. Celem tej zasady jest zgromadzenie klas w ramach komponentu tak aby ograniczyć ilość komponentów potrzebnych do wprowadzania zmian w wymaganiach systemu.

Dobra, po krótkim wstępie, czas na praktykę 🙂 Załóżmy, że mamy jakieś wymagania ogólne dla aplikacji (raczej zawsze takie są, nawet jak nie są wprost zdefiniowane 🙂)

Warto wszystkie elementy systemu (funkcje, klasy, komponenty), które realizują wymagania ogólne, zebrać w jeden komponent. Taki element, to może być np. funkcja, która formatuję datę, jeśli biznes chce, żeby była ona wyświetlana w jednolity sposób w różnych miejsach systemu.

Dzięki temu przy zmianie wymagań ogólnych, np. zmiana formatu daty, będziemy potrzebować zmian tylko w jednym komponencie. Dodatkowo, jeśli zadbamy o niezależne wdrożenia komponentów, to nie będziemy musieli przebudowywać i wdrażać całego systemu przy zmianie w wymaganiach ogólnych.

Aby bardziej to zobrazować to przygotowałem kolejny, bardziej praktyczny przykład. Jeśli mamy dwie klasy związane z użytkownikiem i umieścimy je np. jedną w koszyku, a drugą w stronie konta usera, to zmiana dotycząca userów będzie dotyczyć dwóch komponentów. To znaczy, że zmiana np. typu pola daty urodzin z numeru na string (z timestamp na inny format daty) będzie wymagała zmian w dwóch kompanentach.

Co możemy zrobić w takim przypadku? Powinniśmy wynieść klasę usera do komponentu współdzielonego pomiędzy różne komponenty. Wtedy zmiana będzie dotyczyła jednego komponentu, ewentualnie będzie potrzeba dostosowania pozostałych jeśli zmiana to tzw. Breaking Change (nowa wersja komponentu nie jest kompatybilna z aktualnymi wersjami innych komponentów)

# "Dobry architekt maksymalizuje liczbę niepodjętych decyzji"

Wiem, że to brzmi dość kontrowersyjnie, ale są to słowa Roberta C. Martina 🙂 Krótko opiszę co autor miał na myśli, a potem przejdę do przykładu z życia.

Architektura nie powinna zależeć od szczegółów takich jak konkretna baza danych, biblioteka, albo sposób komunikacji. Łączy się to z odróżnieniem szczegółów implementacji od reguł biznesowych. to w jaki sposób dana operacja powinna być wykonana powinno być odseparowane np. od tego jak to zaprezentować.

Dzięki takiemu podejściu przy projektowaniu systemu możemy odkładać decyzje techniczne na później. Jeśli udaje nam się skutecznie to robić, to odnosimy pewien sukces architektoniczny. Implementacja tej zasady jest dość prosta (nie łatwa, prosta 🙂) Trzeba opakować używane zewnętrzne narzędzie.

Na przykład, załóżmy, że korzystamy z biblioteki do wykonywania zapytań HTTP. Moglibyśmy po prostu używać tego narzędzia w projekcie. Jednak co się stanie jeśli nie będzie ono dla nas wystarczające? Będziemy musieli nanieść zmiany we wszystkich miejscach gdzie go użyliśmy. Tak samo stanie się jeśli twórca tej bilioteki zmieni API.

Jeśli opakujemy funkcjonalność tej bilioteki w nasze własne funkcje, albo klasę, to zmiana w API narzędzia, albo podmiana narzędzia będzie praktycznie bezproblemowa. Wystarczy zmiana w jednym miejscu i dostosowanie nowej biblioteki do starego API - tak, żeby zachować kompatybilność wsteczną.

Wrając do początkowej myśli, nie musimy debatować przez pierwsze 2 tygodnie projektu nad wyborem pomniejszych narzędzi. Może skupić się na implementacji, a takie decyzje podjąć później, kiedy już lepiej będziemy wiedzieć czego potrzebujemy.

Napisałem w pierwszym zdaniu "Dobry architekt", ale nie trzeba być architektem, żeby mieć wpływ na architekturę systemu 🙂 Każdy z deweloperów w zespole może mieć wpływ na podejmowane decyzje techniczne. Jeśli twój zespół zbyt długo zastanawia się nad danym rozwiązaniem, to zaproponuj użycie jakiegokolwiek narzędzie, opakowanie go we wrapper i zrobienie w między czasie researchu w poszukiwaniu najlepszego rozwiązania. 

# Dobra architektura uwzględnia strukturę organizacyjną zespołu deweloperskiego.

Kolejna cenna myśl z książki 🙂

Cel jaki powinien przyświecać architektowi to zniwelowanie wchodzenia sobie w drogę jeśli projekt rozwija wiele zespołów deweloperskich.

Ma to związek ze sprawnymi wdrożeniami. Jeśli system jest podzielony na serwisy i każdy zespół jest odpowiedzialny za inny, to może on niezależnie dokonywać wdrożeń.

Można rozróżnić dwa przypadki.

1️⃣ Jeśli pracujemy nad projektem w jednym mały zespole, to prawdopodobnie nie potrzebujemy niezależnych wdrożeń. Wtedy możemy bez większych przeszkód pracować na monolicie.

2️⃣ Jeśli natomiast kilka zespołów pracuje niezależnie nad jednym projektem, to możliwe, że potrzebujemy architektury mikroserwisowej. Musimy jednak pamiętać, żeby była ona zorganizowana w taki sposób, żeby te niezależne wdrożenia były faktycznie możliwe.

Na przykład usługi nie powinny zależeć od innych usług, bo wdrożenie jednej i tak będzie wymagało wdrożenia innej usługi.

# Podsumowanie

Książka według mnie jest świetna, ale trzeba pamiętać o jednej rzeczy. Ona nie opisuje konkretnych rozwiązań technicznych. Jest bardzo dobrze odseparowania od jakiegokolwiek języka programowania lub technologii. To czyni ją ponadczasową, ale czytelnik może mieć trudność, że przełożyć to na swój własny projekt/system, który rozwija.