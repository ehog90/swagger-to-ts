export class Maybe<T> {
  
    public static some<T>(value: T) {
      if (!value) {
        throw Error('Provided value must not be empty');
      }
      return new Maybe(value);
    }
  
    public static none<T>() {
      return new Maybe<T>(null);
    }
    public static from<T>(value: T) {
      return value ? Maybe.some(value) : Maybe.none<T>();
    }
    private constructor(private value: T | null) {}
  
    public orElse(defaultValue: T) {
      return this.value === null ? defaultValue : this.value;
    }
    public orElseFalse(): T | false {
      return this.value === null ? false : this.value;
    }

    public val() {
      return this.value;
    }

    public do<R>(f: (wrapped: T) => R): Maybe<T> {
      if (this.value === null || this.value === undefined) {
        return Maybe.none();
      } else {
        f(this.value);
        return Maybe.some(this.value);
      }
    }

    public orElseDo<R>(f: () => R): Maybe<T> {
      if (this.value === null || this.value === undefined) {
        f();
        return Maybe.none();
      } else {
        return Maybe.some(this.value);
      }
    }
  
    public map<R>(f: (wrapped: T) => R): Maybe<R> {
      if (this.value === null|| this.value === undefined) {
        return Maybe.none<R>();
      } else {
        return Maybe.some(f(this.value!!));
      }
    }

    public flatMap<R>(f: (wrapped: T) => Maybe<R>): Maybe<R> {
      if (this.value === null || this.value === undefined) {
        return Maybe.none<R>();
      } else {
        return f(this.value);
      }
    }
  }

export function maybe<T>(value: T): Maybe<T> {
    return Maybe.from(value);
  }
  