"use strict";
class Student {
    name;
    constructor(name) {
        this.name = name;
    }
    sayHello() {
        console.log(`Привіт, мене звати ${this.name}`);
    }
}
const student = new Student(2);
student.sayHello();
