export interface INode {
    root: INode | null    // корень
    parent: INode | null  // родитель
    prev: INode | null    // элемент перед данным элемент 
    next: INode | null    // элемент после данного элемента
    first: INode | null   // первый ребенок если есть
    last: INode | null    // последний ребенок если есть
    count: number      // количество детей
    add: (node: INode) => void
    remove: (node: INode) => void
    each: (cb: (node: INode) => void) => void
}