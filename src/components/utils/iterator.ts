interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
}

interface IteratorReturnResult<TReturn> {
    done?: true;
    value: TReturn;
}

type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;

interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>
}

class LilyIterable<T> implements Iterable<T> {
    private values:T[];
    
    constructor(values: T[]) {
        this.values = values;
    }

    [Symbol.iterator](): LilyIterator<T> {
        return new LilyIterator(this.values);
    }
}

export default class LilyIterator<T> implements Iterator<T> {
    private values: T[];
    private index: number;
    private done: boolean;

    constructor(values: T[]) {
        this.values = values;
        this.index = 0;
        this.done = false;
    }

    reset() {
        this.done = false;
        this.index = 0;
    }
    
    next(): IteratorResult<T, any> {
        if (this.done) 
            return {
                done: true,
                value: undefined,
            };

        return {
            done: true,
            value: 0
        }
    }
}