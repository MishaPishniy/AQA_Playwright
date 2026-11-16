class Student {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  sayHello() {
    console.log(`Привіт, мене звати ${this.name}`);
  }
}

const student = new Student('Student');

student.sayHello();
