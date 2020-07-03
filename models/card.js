const fs = require('fs')
const path = require('path')

class Card {
    constructor() {
    }

    static async add(course) {

        const basket = await Card.fetch();
        const index = basket.courses.findIndex(c => c.id === course.id);
        const candidate = basket.courses[index];

        if (candidate) {
            // have course
            candidate.count++;
            basket.courses[index] = candidate
        } else {
            // need add
            course.count = 1
            basket.courses.push(course);
        }

        basket.price += +course.price


        return new Promise((res, rej) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'card.json'),
                JSON.stringify(basket),
                (err) => {
                    if (err) {
                        rej(err)
                    } else {
                        res()
                    }
                }
            )
        })
    }

    static async remove(id) {
        const basket = await Card.fetch();
        const index = basket.courses.findIndex(c => c.id === id);
        const course = basket.courses[index];
        // basket.courses[index]

        if (course.count === 1) {
            // delete
            basket.courses = basket.courses.filter(c => c.id !== id);
        } else  {
            // count--
            basket.courses[index].count--;
        }

        basket.price -= course.price;

        return new Promise((res, rej) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'card.json'),
                JSON.stringify(basket),
                (err) => {
                    if (err) {
                        rej(err)
                    } else {
                        res(basket)
                    }
                }
            )
        })
    }


    static async fetch() {
        return new Promise((res, rej) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'card.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        rej(err)
                    } else {
                        res(JSON.parse(content))
                    }
                }
            )
        })
    }
}

module.exports = Card
