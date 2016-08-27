var _; // globals

describe("About Applying What We Have Learnt", function() {
  var products;

  beforeEach(function () {
    products = [
       { name: "Sonoma", ingredients: ["artichoke", "sundried tomatoes", "mushrooms"], containsNuts: false },
       { name: "Pizza Primavera", ingredients: ["roma", "sundried tomatoes", "goats cheese", "rosemary"], containsNuts: false },
       { name: "South Of The Border", ingredients: ["black beans", "jalapenos", "mushrooms"], containsNuts: false },
       { name: "Blue Moon", ingredients: ["blue cheese", "garlic", "walnuts"], containsNuts: true },
       { name: "Taste Of Athens", ingredients: ["spinach", "kalamata olives", "sesame seeds"], containsNuts: true }
    ];
  });

  /*********************************************************************************/

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (imperative)", function () {
    var i,j,hasMushrooms, productsICanEat = [];

    for (i = 0; i < products.length; i+=1) {
        if (products[i].containsNuts === false) {
            hasMushrooms = false;
            for (j = 0; j < products[i].ingredients.length; j+=1) {
               if (products[i].ingredients[j] === "mushrooms") {
                  hasMushrooms = true;
               }
            }
            if (!hasMushrooms) productsICanEat.push(products[i]);
        }
    }

    expect(productsICanEat.length).toBe(1);
  });

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (functional)", function () {
      var productsICanEat = [];

      /* solve using filter() & all() / any() */
      productsICanEat = _(products).filter(function (product) {
          return product.containsNuts === false && !_(product.ingredients).any(function (ingredient) {return ingredient === "mushrooms";});
      });

      expect(productsICanEat.length).toBe(1);
  });

  /*********************************************************************************/

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (imperative)", function () {
    var sum = 0;

    for(var i=1; i<1000; i+=1) {
      if (i % 3 === 0 || i % 5 === 0) {
        sum += i;
      }
    }

    expect(sum).toBe(233168);
  });

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (functional)", function () {
    var sum = FILL_ME_IN;    /* try chaining range() and reduce() */
    sum = _.range(1000).reduce(function (pre, current) {
      return pre + ((current % 3 === 0 || current % 5 === 0) ? current : 0);
    },0);
    expect(233168).toBe(sum);
  });

  /*********************************************************************************/
   it("should count the ingredient occurrence (imperative)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    for (i = 0; i < products.length; i+=1) {
        for (j = 0; j < products[i].ingredients.length; j+=1) {
            ingredientCount[products[i].ingredients[j]] = (ingredientCount[products[i].ingredients[j]] || 0) + 1;
        }
    }

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should count the ingredient occurrence (functional)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    /* chain() together map(), flatten() and reduce() */
    ingredientCount = _(products.map(function(product) {return product.ingredients;}))
                        .chain()
                        .flatten()
                        .reduce(function (ingredientCount, ingredient) {
                          ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
                          return ingredientCount;
                        }, ingredientCount)
                        .value()

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  /*********************************************************************************/
  /* UNCOMMENT FOR ADVANCED */
  it("should find the largest prime factor of a composite number", function () {

    var findPrimeFactors = function (num) {
      // Trial division
      var maxDivisor = Math.floor(Math.sqrt(num));
      var factors = [1];
      for (var i = 2; i <= maxDivisor; i++) {
        if (num % i === 0) {
          while (num % i === 0) {
            num /= i;
          }
          factors.push(i);
        }
      }
      if (num > maxDivisor) {
        factors.push(num);
      }
      return factors.sort(function (v1, v2) {
        if (v1 > v2) return 1;
        if (v1 < v2) return -1;
        return 0;
      });
    }

    var findLargestPrimeFactor = function (num) {
      var factors = findPrimeFactors(num);
      return factors[factors.length - 1];
    }

    var compositeNumbers = [1,2,3,4,5,7,10,11,13,17,23,47,50,100,101,143,187,799,999,9999];
    var actualLargestPrimeFactor = [1,2,3,2,5,7,5,11,13,17,23,47,5,5,101,13,17,47,37,101];
    _.each(compositeNumbers, function (compositeNumber, i) {
      expect(findLargestPrimeFactor(compositeNumber)).toBe(actualLargestPrimeFactor[i]);
    });
  });

    /*

  it("should find the largest palindrome made from the product of two 3 digit numbers", function () {

  });

  it("should find the smallest number divisible by each of the numbers 1 to 20", function () {


  });

  it("should find the difference between the sum of the squares and the square of the sums", function () {

  });
  */

  it("should find the 10001st prime", function () {
    var isPrime = function (num) {
      if ([1].indexOf(num) !== -1) return true;
      var maxDivisor = Math.floor(Math.sqrt(num));
      for (var i = 2; i <= maxDivisor; i++) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    }

    var findManiethPrime = function (manieth) {
      var primes = [];
      for (var i = 2; primes.length < manieth; i++) {
        if (isPrime(i)) {
          primes.push(i);
        }
      }
      return primes[manieth - 1];
    }

    var manieths = [1,2,3,4,5,10001];
    var actualPrimes = [2,3,5,7,11,104743];
    _.each(manieths, function (manieth, i) {
      expect(findManiethPrime(manieth)).toBe(actualPrimes[i]);
    });

  });
});
