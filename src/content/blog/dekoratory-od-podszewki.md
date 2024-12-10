---
title: "Dekoratory od podszewki"
date: "2020-04-21"
categories: 
  - "javascript"
tags: 
  - "aspect-oriented-programming"
  - "decorator-pattern"
  - "design-patterns"
  - "ecmascript"
  - "javascript"
  - "programowanie-aspektowe"
  - "wzorce-projektowe"
  - "wzorzec-dekorator"
author:
   name: Marek Szkudelski
   picture: '/assets/blog/authors/face.png'
ogImage:
 url: ''
level: "Średniozaawansowany"
description: 'Dekoratory coraz częściej są wykorzystywane w świecie frontendu. W tym wpisie pokazuję jak działają dekoratory pod spodem oraz jak można dekorować metody w czystym Javascript. Omawiam też praktyczne zastosowanie tego wzorca.'
---

Dekoratory są wzorcem projektowym, który jest używany coraz częściej przez frontend developerów. Przykładem jest chociażby Angular, którego bez dekoratorów właściwie nie da się używać. W tym wpisie pokażę jak działają one pod spodem oraz jak można dekorować metody w czystym Javascript. Pokażę też i omówię praktyczne zastosowanie tego wzorca. Zanim jednak przejdziemy do samych dekoratorów postaram się nakreślić jakie problemy one rozwiązują i przez to pokazać jakie mogą mieć zastosowania.

> Dekoratory mają bardzo szeroki zakres zastosowań. Skupię się tylko na wybranych problemach i ich rozwiązaniach w postaci dekoratorów metod.

### Opis problemu

Załóżmy, że mamy jakąś prostą funkcję, która ma być wywołana na każde wywołanie innej funkcji - metody danej klasy. Oczywiście można w tej metodzie po prostu wywołać tę funkcję, ale mamy wtedy do czynienia z side-effect'em. Jest to zachowanie, którego nie spodziewamy się patrząc na deklarację metody. Spójrzmy na poniższy kod:

```typescript
class Cart {
  addProduct(product) {
    this.products.push(product);
    LoggerService.log("Product added!", product);
    this.recalculateTotalPrice();
  }
  ...
}
```

Teraz wyobraźmy sobie, że mamy kilka metod i niektóre mogą być bardziej złożone niż ta powyżej. Jeśli chcemy zobaczyć, które metody zapisują logi przez LoggerService, to musimy analizować implementację każdej z nich.

### Opis wzorca

Wzorzec dekoratora jest najczęściej kojarzony z programowaniem zorientowanym obiektowo, ale jest też częścią paradygmatu AOP, czyli Aspect Oriented Programming. Oznacza to, że do danej metody, klasy czy właściwości dodajemy aspekt względem, którego ją rozpatrujemy. Taki aspekt narzuca dodatkowy kontekst na tę klasę. Dość często jest to dodatkowa funkcjonalność, która bezpośrednio nie jest powiązana z danym elementem. W naszym przykładzie z loggerem takim aspektem jest logowanie dodania produktu. Spójrzmy na snippet poniżej:

```typescript
class Cart {
  @Log("Product added!")
  addProduct(product) {
    this.products.push(product);
    this.recalculateTotalPrice();
  }
  ...
}
```

Dodaliśmy dekorator, który jest odpowiedzialny za dodanie do logów faktu, że został dodany produkt. Dzięki temu pozbywamy się efektów ubocznych z naszej metody i nie łamiemy SRP (Single Responsibility Principle). Ponadto patrząc na deklaracje metod w klasie praktycznie od razu będziemy w stanie stwierdzić których metod wywołanie będzie dodane do logów.

> Dynamicznie dołącza dodatkowe obowiązki do obiektu. Wzorzec ten udostępnia alternatywny elastyczny sposób tworzenia podklas o wzbogaconych funkcjach.
> 
> Fragment książki "_**Wzorce projektowe. Elementy oprogramowania obiektowego wielokrotnego użytku**_"

Jak możemy przeczytać w książce o Wzorcach Projektowych Bandy Czworga, dzięki dekoratorom możemy pójść bardziej w stronę kompozycji zamiast dziedziczenia, żeby dodać funkcje, które realizuje dana metoda bądź klasa. Zamiast tworzyć klasy i po nich dziedziczyć możemy utworzyć dekoratory. W Javascript daje nam to szczególną przewagę, ponieważ dziedziczenie po wielu klasach nie jest możliwe. Możemy natomiast dodać kilka dekoratorów do klasy.

### Podstawy tworzenia dekoratorów

Kontynuując powyższy przykład zobaczymy jak można stworzyć prosty dekorator dla metody w Javascript. Obecnie w czystym języku niestety nie można używać dekoratorów, więc będziemy potrzebowali narzędzia takiego jak Babel, o którym możecie przeczytać w tym [artykule](https://radwojt.medium.com/deep-dive-into-using-es6-in-browsers-with-babel-and-webpack-4aafa8658371). Pominiemy tutaj etap konfiguracji, ale trzeba do konfiguracji Babela dołączyć ten [plugin](https://babeljs.io/docs/en/babel-plugin-proposal-decorators).

Dekorator w naszym przykładzie jest to funkcja wyższego rzędu (Higher Order Function), która zwraca funkcję, która przyjmuje trzy parametry: **target**, **propertyKey**, **descriptor**. Pierwsze dwa są w miarę proste i intuicyjne,

1. **target** jest to klasa, której instancja jest kontekstem w którym będzie wywoływana dana metoda
2. **propertyKey** to nazwa tej metody, prosty string
3. **descriptor** - trzeci parametr, to obiekt deskryptora, która ma zazwyczaj cztery właściwości. Więcej informacji na ten temat można znaleźć [tutaj](https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

Skupimy się na jednej z właściwości descriptor'a, czyli **value**. W przypadku metod jest to funkcja, a w przypadku właściwości ta wartość reprezentuje jej aktualny stan. Nasza funkcja niższego rzędu musi zwrócić descriptor, żeby wszystko poprawnie się wykonało. Spójrzmy na sygnaturę naszego dekoratora do logowania:

```javascript
function Log(message) {
  return function (target, propertyKey, descriptor) { 
    return descriptor;
  }
}
```

Taki dekorator nic nie wnosi do kodu, ale też nie zepsuje go. Jest to stan wyjściowy dla dalszej implementacji. Zwróć jednak uwagę, że korzystamy z Higher Order Function tylko dlatego, że musimy przekazać **message** do dekoratora. W przeciwnym wypadku byłaby to prosta funkcja trójumentowa i zwracająca deskryptor.

#### Implementacja dekoratora

Mamy nasz dekorator, który zwraca funkcję, która może udekorować metodę. W jej implementacji możemy nadpisać **descriptor.value**, ale samo przypisanie nowej wartości będzie złym pomysłem, bo w taki sposób nie wywołamy metody, która ma być udekorowana. Dlatego musimy przypisać funkcję, która wewnątrz wywoła nam metodę.

```javascript
function Log(message) {
  return function (target, propertyKey, descriptor) { 
    const originalFunction = descriptor.value;
    descriptor.value = function(...args) {
      LoggerService.log(message, ...args);
      return originalFunction.call(this, ...args);
    }
    return descriptor;
  }
}
```

W powyższym kodzie dzieje się kilka rzeczy, które wymagają wytłumaczenia. Po pierwsze przypisujemy metodę do **originalFunction**, żeby nam nie "uciekła". W najbardziej zagnieżdżonej funkcji zbieramy spread operator'em wszystkie parametry jakiem może przyjąć metoda. Nie jesteśmy w stanie przewidzieć ile będzie tych argumentów, więc musimy je zgrupować w tablicę **args**.

Następnie zakładamy, że chcemy dodać do logów również wszystkie parametry przekazane, więc ponownie używamy spread operator'a. Podobnie robimy przy wywołaniu oryginalnej metody. Ale zanim ją wywołujemy to trzeba zrobić bardzo ważną rzecz bez której możemy mieć problemy, które nie łatwo zdebugować (chyba, że wcześniej już się miało z tym do czynienia). Musimy powiązać metodę na nowo z instancją klasy. Bez tego będzie ona wywoływana w zupełnie innych kontekście. Wykorzystując metodę **call** ([dokumentacja](https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Function/call)) zmieniamy kontekst wywołania na przekazany parametr, czyli **this**.

### Dekoratory w syntaxie ES5

Napisałem wyżej, że potrzebujemy jakiegoś narzędzia transpilującego nasz kod, żeby w ogóle użyć dekoratorów. Jednak takie narzędzie konwertuje kod do standardu EcmaScript 5, więc istnieje możliwość napisania dekoratora w czystym Javascript zrozumiałym przez wszystkie przeglądarki. Co prawda nie będziemy mógli użyć nowoczesnej składni ze znakiem @, ale pomimo to pokażę jak to mogłoby wyglądać.

Najpierw musimy zadeklarować funkcję **decorate**, która będzie odpowiedzialna za wykorzystanie konkretnych dekoratorów na poszczególnych funkcjach. Przyjmuje ona **target**, który jest obiektem, **property**, które jest nazwą metody oraz funkcję **callback**. Dzięki dwóm pierwszym parametrom możemy uzyskać deskryptor metody i przekazać go do **callback**u.

```javascript
function decorate(target, property, callback) {
  const descriptor = Object.getOwnPropertyDescriptor(target, property);
  Object.defineProperty(target, property, callback(descriptor));
}
```

**Callback** jest to funkcja która dostaje deskryptor, więc tam mamy możliwość nadpisania metody. To jest właśnie nasz dekorator. Przykładowe wywołanie funkcji **decorate** mogłoby wyglądać następująco:

```javascript
decorate(cart, 'addProduct', Log('Product added!'));
```

Oczywiście funkcja **Log** będzie miała bardzo podobną implementację, ale będzie zwracała funkcję, która przyjmuje tylko jeden parametr i jest to deskryptor.

Duża różnica pomiędzy nowoczesnym rozwiązaniem, a tym z standardu EcmaScript 5 polega na tym, że tutaj dekorujemy obiekt, czyli daną instancję. W nowszym Javascript dekorujemy metodę klasy, więc wszystkie instancje będą udekorowane. Oczywiście działamy w języku, który jest bardzo elastyczny, więc w ES5 można również udekorować metodę w prototypie, ale uważam, że takie rozwiązanie nie wyglądałoby zbyt dobrze - nie dawałoby żadnych korzyści.

Obydwa przykłady znajdziesz jako pełne działające rozwiązania tutaj w [Stackblitz](https://stackblitz.com/edit/js-decorator-pattern).

### Podsumowanie

Jak wspomniałem wyżej trzeba odpowiednich narzędzi, żeby dekoratory zadziałały w przeglądarce. Była propozycja aby wciągnąć dekoratory do standardu EcmaScript ([Decorators Proposal](https://github.com/tc39/proposal-decorators)), ale dotyczy ona nieco innej składni niż omawiana w tym artykule. Proposal jest w Stage 2 i tam pozostanie, bo niestety nie został zaakceptowany przez organizację TC39. Jeśli chcesz więcej poczytać o dekorowaniu w Javascript, to ten artykuł jest dobrym źródłem wiedzy:

[https://www.simplethread.com/understanding-js-decorators/](https://www.simplethread.com/understanding-js-decorators/)
