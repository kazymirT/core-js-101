/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const data = JSON.parse(json);
  const obj = Object.create(proto);
  Object.assign(obj, data);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelectorBuilder {
  constructor() {
    this.selectors = [];
    this.elementCount = 0;
    this.idCount = 0;
    this.pseudoElementCount = 0;
    this.classCount = 0;
    this.attrCount = 0;
    this.pseudoClassCount = 0;
  }

  element(value) {
    if (this.elementCount === 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (this.selectors.length > 0) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    } else {
      this.selectors.push(value);
      this.elementCount += 1;
      return this;
    }
  }

  id(value) {
    if (this.idCount === 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (this.classCount > 0 || this.pseudoElementCount > 0) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    } else {
      this.selectors.push(`#${value}`);
      this.idCount += 1;
      return this;
    }
  }

  class(value) {
    if (this.attrCount > 0) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.classCount += 1;
    this.selectors.push(`.${value}`);
    return this;
  }

  attr(value) {
    if (this.pseudoClassCount > 0) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.attrCount += 1;
    this.selectors.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElementCount > 0) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.pseudoClassCount += 1;
    this.selectors.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementCount === 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else {
      this.selectors.push(`::${value}`);
      this.pseudoElementCount += 1;
      return this;
    }
  }

  combine(selector1, combinator, selector2) {
    this.selectors.push(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
    return this;
  }

  stringify() {
    return this.selectors.join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelectorBuilder().element(value);
  },

  id(value) {
    return new CssSelectorBuilder().id(value);
  },

  class(value) {
    return new CssSelectorBuilder().class(value);
  },

  attr(value) {
    return new CssSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new CssSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CssSelectorBuilder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
