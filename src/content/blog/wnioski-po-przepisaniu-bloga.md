---
title: "Wnioski po przepisaniu bloga"
date: "2025-01-13"
categories: 
  - "self-develop"
tags: 
  - "rozwój"
  - "dzielenie się wiedzą"
  - "self-develop"
author:
   name: Marek Szkudelski
   picture: '/assets/blog/authors/face.png'
ogImage:
 url: ''
level: ""
published: 'true'
description: 'Poznaj kulisy przepisania mojego bloga. W artykule dzielę się przemyśleniami na temat popełnionych błędów, właściwego podejścia do planowania oraz realistycznego wykorzystania narzędzi AI w procesie developmentu. To praktyczny przewodnik pokazujący, jak ważne jest skupienie się na głównym celu projektu, zamiast gubić się w dodawaniu zbędnych funkcjonalności.'
---

Poznaj kulisy przepisania mojego bloga. W artykule dzielę się przemyśleniami na temat popełnionych błędów, właściwego podejścia do planowania oraz realistycznego wykorzystania narzędzi AI w procesie developmentu. To praktyczny przewodnik pokazujący, jak ważne jest skupienie się na głównym celu projektu, zamiast gubić się w dodawaniu zbędnych funkcjonalności.

## Dlaczego zdecydowałem się na przepisanie bloga

Minęło zaledwie kilka lat, od kiedy postawiłem swojego bloga na **Next.js**. Ktoś mógłby pomyśleć, że **przepisanie całości po tak krótkim czasie** jest bez sensu, bo nawet nie zdążyło się nagromadzić zbyt dużo długu technologicznego. Poprzednia wersja bloga jest wciąż napisana w dość świeżych technologiach. Czemu więc zdecydowałem się to zrobić?

Po pierwsze, chciałem **połączyć moją stronę wizytówkę z moim blogiem pod jedną domeną**. Wcześniej miałem swoją wizytówkę na [szkudelski.dev](http://szkudelski.dev), a osobno blog na blog.szkudelski.dev. Wynika to z tego, że kiedyś współprowadziłem bloga postawionego na WordPressie, a chciałem mieć swoją stronę, która będzie stricte o mnie i moim doświadczeniu. Tak więc postawiłem ją osobno na czystym JS. Później blog podupadł, a ja chciałem "przejść na swoje".

Chciałem zrobić to ekstremalnie szybko i efektywnie. Uznałem, że najszybszym sposobem będzie eksport moich artykułów z WordPressa do Markdowna. Zdecydowałem się na użycie szablonu postawionego na Next.js. Rzeczywiście udało mi się zrobić to bardzo szybko - poświęciłem tylko kilka godzin w weekend i blog był gotowy. Ale miałem dwie strony, które były tylko trochę spójne, a przede wszystkim były na dwóch różnych subdomenach.

OK, ale mogłem po prostu dodać podstronę "O mnie" na blogu. Niby tak, ale potrzebowałem też **odświeżenia - zarówno technologicznego, jak i wyglądowego**. Jak wspomniałem, blog powstał bardzo szybko, więc kod nie był ładny, a design był robiony "na kolanie". Zamiast bazować na kodzie i stylach sprzed kilku lat, zdecydowałem się zrobić to na nowo.

Dodatkowo miałem ogromną chęć **zrobienia projektu na boku, ale bez spiny**. Dzięki przepisywaniu bloga mogłem **poznać nowe technologie, narzędzia oraz porządnie przećwiczyć AI** - w tym przypadku różne modele poprzez GitHub Copilot.

## Jaki stack i dlaczego

Po dość krótkim researchu zdecydowałem się na **Astro.js**. Głównymi przyczynami była rosnąca popularność, dobre opinie i **focus twórców na "odchudzenie" kodu wynikowego ze zbędnego JSa**. Chciałem mieć stabilne narzędzie, które pozwoli mi dostarczyć lekką stronę.

Użyłem do mojego przypadku szablonu, który musiałem tylko trochę pozmieniać i dopisać do niego parę feature'ów pod moje potrzeby. Do stylów użyłem **Tailwinda**, co mocno przyspieszyło pracę nad spójnym wyglądem strony.

**Interaktywne komponenty napisałem w Reakcie**, bo najlepiej go znam, ale Astro jest framework-agnostic. Zakładam, że w przyszłości spróbuję napisać komponent np. w Svelte. Jest to świetny atut Astro jako metaframeworka 🙂

Tak jak poprzedni blog, tę stronę postawiłem na **Netlify**. Jak zwykle jestem usatysfakcjonowany prostotą automatycznych deployów oraz łatwą konfiguracją. Niestety trochę utrudniłem sobie życie, bo chciałem mieć **automatycznie generowane zdjęcia Open Graph**. Użyłem do tego API napisane w Astro, ale wdrożenie tego z Netlify Function zajęło mi parę godzin 😕

> Note: Open Graph to zestaw specjalnych meta tagów, które umożliwiają kontrolowanie, jak treści z danej strony internetowej są prezentowane na platformach społecznościowych, takich jak Facebook, Twitter, LinkedIn czy Pinterest.

## Jakie błędy popełniłem?

Oczywiście popełniłem szereg błędów, jak przy każdym projekcie 🙂 Zawsze staram się wyciągać wnioski, żeby w przyszłości robić coś lepiej, ale też żeby przestrzec innych - na przykład w formie tego wpisu.

### Zacząłem pracować z narzędziem, nie znając go

**Przeczytałem pobieżnie o Astro, pobrałem szablon i zacząłem pracę**. Nie zgłębiłem tematu ani trochę poza totalne minimum i przez to miałem parę problemów. Wiele razy błądziłem po omacku, starając się rozwiązać problemy, których nie wiedziałem, skąd się wzięły. 

Na przykład, jak wspomniałem przy wyborze technologii, Astro ogranicza rozmiar klienckiego JS do minimum. Oznacza to, że **musisz wprost zaznaczyć, który skrypt ma trafić do klienta**. Domyślnie Astro nie wyśle nic, co napisałeś. Podczas lokalnego developmentu wszystko działało mi OK, ale po wdrożeniu nagle moje feature'y nie działały, a ja tylko strzelałem, o co chodzi.

Musiałem zrobić krok wstecz, zajrzeć do dokumentacji, żeby pójść z tematem dalej. A wystarczyło na początku **przeczytać o podstawowych konceptach Astro** 🙂

### Nie ograniczyłem się do MVP

Zamiast przepisać bloga i oficjalnie go wypuścić, **skupiłem się na feature'ach, ulepszeniach i udogodnieniach**, których wcześniej nie miałem i prawdopodobnie teraz też nie są niezbędne. Napisałem przynajmniej kilka takich nice-to-have. 

Między innymi były to: rozwijanie treści w zakładce Doświadczenie, rozwijanie pełnego opisu artykułu na liście wpisów, znikający formularz do newslettera, kiedy ktoś już się zapisał, filtry wpisów (pomimo tego, że mam ich niecałe 20 😀). Najwięcej czasu zeszło mi na generowaniu customowych zdjęć Open Graph. **Przepaliłem kilka godzin na napisanie kodu i potem kolejnych kilka na problemy z wdrożeniem**. 

### Skupienie na oprawie, a nie na treści

Zamiast postawić MVP i wrócić do pisania artykułów, dopracowywałem blog do perfekcji. A perfekcyjny i tak nie jest 😉 **Zapomniałem, jakie są cele bloga**. Przede wszystkim chcę się dzielić wiedzą i doświadczeniem oraz budować moją markę osobistą. Daleko w tyle na liście moich priorytetów jest dowieźć fajną i ładną stronę.

Niestety **nie stworzyłem na początku planu i podziału planowanych funkcjonalności** na must-have oraz nice-to-have. Zacząłem pracę "na hurra" i z rozpędu robiłem za dużo. Zajęło mi to też za dużo czasu.

## Pierwszy projekt pisany przy asyście AI

Wcześniej korzystałem z AI do robienia researchu albo do kodowania. Na co dzień towarzyszył mi głównie **ChatGPT, Claude, Perplexity oraz GitHub Copilot**. Jednak zawsze była to praca na już istniejących projektach. Tym razem **zacząłem pracę od początku do końca z AI**.

Zacząłem od researchu dostępnych narzędzi. Tutaj niezawodne jest **Perplexity**. Świetne narzędzie do przeszukiwania internetu i prezentacji wniosków w podanym przez nas formacie.

Do pisania kodu użyłem **Copilota z różnymi modelami** - Claude 3.5 Sonnet, GPT 4o oraz o1.

Dodatkowo po kilku latach pracy na produktach od JetBrains zacząłem pisać w Visual Studio Code, żeby **wycisnąć maksa z feature'ów Copilota**. 

**Najsensowniejsza praca z Copilotem to funkcja Edits**, czyli pozwolenie mu na edycję wielu plików jednocześnie i tworzenie nowych plików. Świetnie się to sprawdza do pisania nowych feature'ów. Trochę gorzej do modyfikacji, a kiepsko przy próbie naprawy błędów.

Jeśli chodzi o ten ostatni aspekt, to jestem trochę zawiedziony Copilotem. Myślałem, że przy jakimś bugu będzie on w stanie podać mi sensowne rozwiązania, biorąc pod uwagę kontekst aplikacji. Pomimo to **często był niekrytyczny wobec siebie i na siłę szedł w stronę konkretnego rozwiązania**. Dopiero użycie Copilot Chata do burzy mózgów nad rozwiązaniem problemu przynosiło dobre efekty.

### Wnioski

**Miałem złe podejście do GenAI na początku projektu**, które wynikało z wygórowanych oczekiwań. Myślałem, że mogę podejść do niego jak klient, który chce mieć takie i takie feature'y na stronie. Bardzo często musiałem schodzić o poziom niżej i pisać do Copilota jak programista potrzebujący wsparcia. **Dużo lepiej sprawdzało się podejście "Napisz mi funkcję, która przyjmie to i to, zrobi to i zwróci to, a jeśli nie, to pokaże taki komunikat" niż podejście w stylu "Stwórz mi taki feature"**.  

Nie wiem, czy to odnosi się do innych narzędzi, ale **Copilota najlepiej traktować jako programistę przy pair programmingu**. Nie korzystałem jeszcze z innych podobnych narzędzi (np. Cursor) oraz nie twierdzę, że korzystam z GenAI bardzo dobrze. Są to moje przemyślenia po ostatnich tygodniach 😉

## Podsumowanie

To, co właśnie oglądasz, to efekt mojej pracy z kilku tygodni po godzinach. Podsumujmy wnioski, które mam po realizacji tego projektu i które, mam nadzieję, Ty też możesz zastosować:

- **Planowanie przed rozpoczęciem** - przed startem projektu warto dobrze poznać narzędzia i stworzyć plan MVP, zamiast rzucać się na głęboką wodę i dodawać zbyt wiele funkcji naraz
- **Priorytety i cele** - skupienie się na głównym celu (w tym przypadku dzielenie się wiedzą) jest ważniejsze niż dopracowywanie technicznych aspektów i dodatkowych funkcjonalności
- **Realistyczne podejście do AI** - narzędzia AI (jak GitHub Copilot) najlepiej sprawdzają się jako wsparcie programisty, a nie jako samodzielne rozwiązanie do tworzenia funkcjonalności

Całość tego projektu znajduje się na moim GitHubie [tutaj](https://github.com/mszkudelski/blog2.0).