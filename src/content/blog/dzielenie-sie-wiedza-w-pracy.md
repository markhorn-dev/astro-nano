---
title: "Dzielenie się wiedzą techniczną w pracy"
date: "2022-07-11"
categories: 
  - "self-develop"
tags: 
  - "rozwój"
  - "dzielenie się wiedzą"
  - "praca zespołowa"
  - "self-develop"
author:
   name: Marek Szkudelski
   picture: '/assets/blog/authors/face.png'
ogImage:
 url: ''
level: ""
published: 'true'
description: 'W branży IT dzielenie się wiedzą wygląda zupełnie inaczej niż w wielu innych. Mamy potrzebę dzielenia się wiedzą, nowinkami i ciekawostkami technicznymi. Podzielę się z wami jak ja to robię.'
---

Myślę, że w naszej branży dzielenie się wiedzą wygląda zupełnie inaczej niż w wielu innych. Zazwyczaj pracujemy w zespołach, a to oznacza, że musimy często mieć do czynienia z kodem kolegi/koleżanki. Oznacza to też, że za wyniki jesteśmy rozliczani jako zespoły, więc chcemy, że inni dowozili swoje zadania przynajmniej tak szybko jak my (nie schodząc z jakości kodu) Chcemy wyrównywać poziom (oczywiście w górę ;) ) innych członków zespołu.

Właśnie dlatego mamy, bardzo często naturalną, potrzebę dzielenia się wiedzą, nowinkami i ciekawostkami technicznymi. Są różne sposoby, żeby to realizować. Bazując na własny doświadczeniu, chciałby przedstawić kilka sposób, które u mnie się sprawdziły. 

# Code Review

Wbrew pozorom najlepszym według mnie sposobem na dzielenie się wiedzą to proces Code Review. Oczywiście liczy się tutaj, jak przeglądamy kod oraz jakiego typu komentarze zostawiamy. Jako Reviewer możemy czegoś nauczyć osobę wystawiającą Pull Request'a, albo samemu się czegoś nowego dowiedzieć.

W pierwszym przypadku razem z naszymi uwagami do kodu powinniśmy postarać się przedstawiać alternatywne rozwiązanie. W zależności od sytuacji może się przydać argumentacja naszego podejścia. Można też dołączyć jakieś przydatne linki do dokumentacji lub blogpostów opisujących dany temat. Wszystko zależy od naszych intencji. 

Jeśli chcemy, żeby tylko jakość kodu była wyższa, to będziemy dawać komentarze w stylu "zrób tak", albo "nie rób tak". Dość prawdopodobne, że spotkamy się z podobnymi problemami w kolejnych PRach. Jeśli jednak przekażemy większą świadomość razem z naszym komentarzem, to możemy się spodziewać lepszych umiejętności naszego kolegi i zarazem lepszej jakości kodu w przyszłości.

Drugi przypadek dotyczy sytuacji kiedy my nie do końca mamy wiemy, dlaczego osoba wystawiająca PR w taki sposób coś zapisała albo w ogóle nie znamy tego elementu danego języka, biblioteki lub technologii. Wtedy najlepiej poczytać o tym na przykład w dokumentacji. Jeśli fragment kodu jest bardziej złożony, albo nasza wątpliwość dotyczy bardziej powodu podjęcia jakiejś decyzji, to najlepiej zadać pytanie.

Warto też dodać, że całkiem możliwe, że nie tylko Ty jako Reviewer oraz osoba wystawiająca PR się czegoś dowiecie. Nauczyć się czegoś nowego może każda osoba, która wejdzie w dany PR i poczyta komentarze.

Proces Code Review to dość rozległy i pewnie w niektórych aspektach kontrowersyjny. Dość ważne jest, że zaznaczyć, że uzupełnianie wiedzy w zespole jest przydatnym dodatkiem do tego procesu, ale głównym jego zadaniem jest podnoszenie jakości kodu oraz oprogramowania.

> Więcej o code review możecie przeczytać w artykule Radka Wojtysiaka
>
> https://www.linkedin.com/pulse/kompendium-code-review-jak-efektywnie-wykonywa%C4%87-kodu-wojtysiak-1c/

# Pair programming

Z moich doświadczeń wynika, że najczęściej jest to nie sformalizowana (chociaż wiem, że są firmy gdzie wyglada to inaczej) forma pisania kodu przez dwóch programistów. Jak to mówią "co dwie głowy to nie jedna" i myślę że w przypadku programowania to przysłowie też ma dużo racji. W obecnych czasach kiedy dominuje praca zdalna, takie programowanie może nie być tak łatwe, ale na szczęście są narzędzia które to ułatwiają. Z darmowych jest na przykład Visual Studio Code Live Share.

Pozwala ono na udostępnienie innej osobie swojego lokalnego repozytorium. Dzięki temu dwie (lub więcej) osób może wspólnie pisać ten sam kod. Może to okazać się dużym ułatwieniem w przypadku pisania większych fragmentów kodu.

Najczęstsze sytuacje w których ja spotykam się z pair programmingiem to przypadki kiedy ja mam jakiś problem albo ktoś inny zgłasza się do mnie po pomoc. Może to być jakiś błąd, który nie wiemy jak naprawić. Może to być też wątpliwość odnośnie wymyślonego albo już zaimplementowanego rozwiązania. Wtedy najprościej połączyć się przez komunikator firmowy, udostępnić ekran i pokazać nasz problem.

Bardzo często bywa, że samo opisanie problemu drugiej osobie już nam nasunie rozwiązanie. Nie rzadziej jest też to chwila kiedy możemy skorzystać z pomocy innego programisty i nauczyć/dowiedzieć sie czegoś nowego.

# Cykliczne spotkania zespołowe

Szczególnie przy średnich i większych zespołach (ponad 3-4 osoby) oraz dopiero formujących się, warto regularnie się spotykać, żeby omawiać tematy typowo techniczne.

Jest to idealne pole do omawiania różnych problemów, podejmowania wspólnych kroków w rozwoju technologicznym projektu.

Jestem zdania, że każda osoba w zespole powinna mieć prawo głosu, niezależnie od doświadczenia. Nie raz spotkałem się z sytuacją kiedy junior dev rzucił nowe światło na sprawę techniczną, które seniorzy przeoczyli. Warto słuchać każdego i nie deprecjonować czyjegoś zdania patrząc przez pryzmat jego stażu pracy.

Takie spotkania to idealna przestrzeń, żeby każdy mógł się wypowiedzieć.

> Tip: 
>
> Warto zapisywać tematy z wyprzedzeniem - wtedy kiedy przychodzą nam do głowy, bo często uciekają. Można też prowadzić współdzieloną listę