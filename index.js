const defineModule = (name, obj) => {
  const promise = (() => new Promise((resolve, reject) => {
      if (obj) {
        setTimeout(() => {
          resolve(obj);
        }, 0); // добавляем в мультиплексор на 0 секунд, а после в очередь
      } else {
        throw new Error('empty props');
      }
    })
  )();

  if (global.modules) {
    global.modules[name] = promise;
  } else {
    global.modules = {};
    global.modules[name] = promise;
  }
};

const requireModule = (name) => {
  if (global.modules && global.modules[name]) {
    return global.modules[name];
  } else {
    throw new Error('!!!! undefinend module !!!!');
  }
}

// объявляем модуль
defineModule('calc', {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  div: (a, b) => a / b,
  mul: (a, b) => a * b
});

// включаем модуль через чанки
requireModule('calc').then(calc => {

  // логика из модуля
  console.log(`${calc.add(1, 1)} - result 1`); // выполнится ка только из стека уйдет console.log('1 - test');
});

// включаем модуль через async/await
(async () => {
  // включаем модуль
  // выполнится ка только из стека уйдет console.log('1 - test') и console.log(`${calc.add(1, 1)} - result 1`);
  const calc = await requireModule('calc');  
  console.log(`${calc.div(40, 2)} - result 2`);
})();

console.log('1 - test'); // попадает в стек первым