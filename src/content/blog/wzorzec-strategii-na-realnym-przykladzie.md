---
title: "Wzorzec strategii na realnym przykładzie"
date: "2020-04-04"
categories: 
  - "typescript"
tags: 
  - "design-patterns"
  - "javascript"
  - "strategy-pattern"
  - "typescript"
  - "wzorce-projektowe"
  - "wzorzec-strategii"
author:
    name: Marek Szkudelski
    picture: '/assets/blog/authors/face.png'
ogImage:
  url: ''
level: "Średniozaawansowany"
description: 'W tym artykule chciałbym zagłębić się we wzorzec strategii i jego implementację w języku Typescript. Nie chcę jednak opierać się na przykładach oderwanych od prawdziwych problemów, z którymi na codzień się zmagamy. Dlatego przygotowałem dla was przykład strategii, którą implementowałem osobiście w pracy.'

--- 

W tym artykule chciałbym zagłębić się we wzorzec strategii i jego implementację w języku Typescript. Nie chcę jednak, żeby to było suche przedstawienie teorii, którą większość z Was pewnie już słyszała/czytała. Nie chcę też opierać się na przykładach oderwanych od prawdziwych problemów, z którymi na codzień się zmagamy. Dlatego przygotowałem dla was przykład strategii, którą implementowałem osobiście jakiś czas temu w pracy. Postaram się też pokazać dlaczego zdecydowałem się na takie rozwiązanie i jakie to przyniosło korzyści.

### Opis wymagań

Ogólna koncepcja była taka, że miał być zrobiony kolejny moduł w aplikacji dla budowlańców. Miał być to sklep, czyli trzeba było mieć listę produktów, koszyk, cały proces zamawiania i tak dalej. Brzmi jak standardowy sklep internetowy, ale był jeden haczyk... Niektóre produkty mogły być na sprzedaż, a inne na wynajem. Pracownicy budowlani potrzebują różne materiały, które zużyją w trakcie budowy. Potrzebują też sprzęty, które będą wykorzystywać i właśnie je chcą wynajmować na określony czas. Tutaj zaczynają się komplikacje, bo w celu obliczenia ceny produktu na wynajem nie można jedynie pomnożyć ilości i ceny. Trzeba obliczyć na ile dni ma być wynajęty produkt, a następnie pomnożyć to razy iloczyn ceny i ilości. W tym momencie można już zobaczyć oczyma wyobraźni wyrażenia warunkowe. Będzie trzeba pisać je w miejscach gdzie zachodzi liczenie ceny produktu, ponieważ w koszyku możemy mieć dwa rodzaje produktów.

Dodatkowym wymaganiem było również by podsumowanie oraz szczegóły zamówienia wyświetlały sposób obliczania ceny za dany produkt. Czyli tekst w stylu "30 szt. x 7 dni x 50 zł". To oznacza, że jest kolejne miejsce gdzie musimy dodać warunek sprawdzający, czy jest to produkt na sprzedaż.

### Rozważanie różnych rozwiązań

Pierwsze rozwiązanie, które jest powszechnie używane polega na decydowaniu o tym czy jest to produkt na sprzedaż w odpowiednim momencie, czyli obliczania ceny produktu albo generowania tekstu tych obliczeń. To oznacza, że takie samo wyrażenie warunkowe musimy umieścić w przynajmniej dwóch miejscach w kodzie. Mogłoby to wyglądać mniej więcej tak:

```typescript
class CartProduct {
  ...
  getProductCost() {
    if(this.isForSale) {
      return ...;
    } else ...
  }

  getCostCalculationsText() {
    if(this.isForSale) {
      return ...;
    } else ...
  }
}
```

Takie rozwiązanie nie wygląda aż tak źle, ale można zauważyć dwa problemy. Pierwszy jest taki, że może ulec zmianie nazwa pola **isForSale**. Może się nawet całkowicie zmienić logika decydowania o tym który produkt jest na sprzedaż. Wtedy będzie trzeba podmieniać ten warunek w wielu miejscach. Na razie są to dwa wystąpienia, ale nie wiadomo, czy w przyszłości nie będzie ich więcej.

Drugi problem jaki można zauważyć, to mniejsza czytelność klasy i jej metody przez dodatkowe zagnieżdżenia. Dużo łatwiej czytałoby się kod, gdyby wygladał on tak:

```typescript
class CartProduct {
  ...
  getProductCost() {
    return ...;
  }

  getCostCalculationsText() {
    return ...;
  }
}
```

O ile pierwszy problem można byłoby rozwiązać za pomocą enkapsulacji logiki, to drugi raczej nie ma innego możliwego (lub też sensownego) rozwiązania. Te właśnie dwa problemy ma za zadanie rozwiązać za nas wzorzec strategii. Oczywiście mogłem pominąć jakieś rozwiązanie, więc jeśli tak jest to daj mi znać w komentarzu ;)

### O wzorcu strategii

Jak możemy przeczytać w słynnej książce o wzorcach projektowych autorstwa tak zwanej Bandy Czworga:

> Define a family of algorithms, encapsulate each one, and make them  
> interchangeable. Strategy lets the algorithm vary independently from  
> clients that use it.
> 
> Fragment książki "_**Design Patterns: Elements of Reusable Object-Oriented Software**_"

Jeśli chcemy zastosować wzorzec strategii, to musimy znaleźć podobne algorytmy, wydzielić je najlepiej do osobnych klas. Następnie trzeba sprawić, że będą mogły być używane zamiennie. Innymi słowy klasa powinna przyjmować jako argument konstruktora inną klasę, która będzie strategią, albo sama decydować o tym, której strategii użyć. Klasy, które są strategiami powinny mieć taką samą lub podobną strukturę, dzięki której możemy rozpoznać, że należą one do rodziny tej samej strategii. Tutaj przychodzi nam z pomocą abstrakcja, którą jest interfejs. Dzięki niemu określamy jak strategia ma wyglądać, jakie ma mieć metody publiczne oraz właściwości. Dlatego właśnie rozmawiamy o wzorcu strategii w kontekście Typescript'a, a nie Javascript'a. JS oczywiście ma składnię pozwalającą na deklarowanie klas, ale nie ma w nim możliwości stworzenia abstrakcji, która nam pomoże wymusić konkretną strukturę klasy.

### Implementacja

Przechodząc do kodu, to musimy zastanowić się jak ma wyglądać i co ma robić nasza strategia. W naszym przypadku ma obliczać koszt zamówienia produktu oraz generować tekst tych obliczeń, więc klasy tej strategii będą musiały mieć dwie metody publiczne. Zadeklarujmy więc interfejs:

```typescript
interface CostStrategy {
  calculateCost(
    price: number, quantity: number, deliveryDate?: Date, returnDate?: Date
  ): number;
  getCostCalculationText(
    price: number, quantity: number, deliveryDate?: Date, returnDate?: Date
  ): string;
}
```

Mamy tutaj dwie metody przyjmujące cenę produktu, ilość tego produktu w koszyku oraz opcjonalnie datę dostawy i zwrotu, żeby wyliczyć ilość dni najmu. Następnym krokiem będzie deklaracja klasy, która implemetuje te dwie metody:

```typescript
class SaleCostStrategy implements CostStrategy {
  calculateCost(price: number, quantity: number): string {
    return ...;
  }

  getCostCalculationText(price: number, quantity: number): string {
    return ...;
  }
}
```

Nie będę się tutaj skupiał na szczegółach implementacyjnych. Link do całości działającego rozwiązania znajdziecie poniżej. Druga klasa naszej strategii dotycząca produktów na wynajem będzie wyglądać bardzo podobnie i też ją znajdziecie w gotowym rozwiązaniu. Kiedy mamy już nasze strategie to nie pozostaje nic innego jak użyć ich w klasie produktu.

```typescript
class CartProduct {
  private costStrategy: CostStrategy;

  getProductCost() {
    return this.costStrategy.calculateCost(...);
  }

  getCostCalculationsText() {
    return this.costStrategy.getCostCalculationText(...);
  }
}
```

Tutaj akurat nie ma za bardzo czego omawiać, bo mamy proste wywołanie metod z klasy strategii. Zwróć jednak uwagę na to jaki typ ma właściwość **costStrategy.** Jest to interfejs, ponieważ w momencie deklarowania klasy nie wiemy jaka strategia może być użyta, więc trzeba to pole otypować abstrakcją. Tak więc mamy przygotowaną klasę CartProduct na przechowywanie różnych strategii liczenia kosztów produktu i publiczne metody tej klasy będą wyłowywać metody strategii. Został ostatni element układanki, czyli wybranie odpowiedniej strategii. W tym celu musimy dodać konstructor do implementacji klasy.

```typescript
class CartProduct {
  private readonly costStrategy: CostStrategy;

  constructor(product) {
    this.costStrategy = 
      product.isForSale ? 
        new SaleCostStrategy() : 
        new RentCostStrategy();
  }
}
```

Tutaj dostajemy obiekt produktu i _dla uproszczenia_, żeby nie tworzyć kolejnych abtrakcji, użyłem typu **any** (niejawnie). Przy tworzeniu instancji **CartProduct** decydujemy, którą strategię użyć. Dodatkowo zmieniliśmy pole **costStrategy**, żeby było tylko do odczytu, ponieważ nie chcemy w trakcie życia instancji klasy omyłkowo zmienić strategii.

#### Przykład na stackblitz

Jak mogłeś zauważyć kod, który tu zaprezentowałem nie będzie działał. Celowo użyłem wielu uproszczeń, żeby pokazać esencję omawianego tematu. Dzięki temu, mam nadzieję, że udało mi się wyeksponować to czym jest wzorzec strategii i jak go użyć w języku Typescript. Ale jeśli chciałbyś zobaczyć jak to się spina razem i zobaczyć jak to wygląda w całości, a nie tylko w kawałkach kodu, to przygotowałem dla Ciebie cały ten przykład jako działające demo. [Tu masz link.](https://stackblitz.com/edit/strategy-pattern-ts)

### Podsumowanie

Jeśli wcześniej nie implementowałeś wzorca strategii w swoich projektach, to mam nadzieję, że dostarczyłem Ci wystarczająco wiedzy na ten temat. Starałem się przekazać Ci intuicję kiedy można zastosować takie rozwiązanie. Jeszcze raz w dużym skrócie napiszę kiedy powinieneś zdecydować się wzorzec strategii. Jeśli masz miejsca w swoim kodzie, które realizują podobną funkcjonalność, ale w nieco inny sposób, to możesz je wydzielić do klas o takie samej strukturze. Idealnym narzędziem w web developmencie jest do tego Typescript przez fakt posiadania interfejsów. W Javascripcie też da się to zrobić, ale będziemy mieli mniejszą kontrolę na strukturą strategii. 
