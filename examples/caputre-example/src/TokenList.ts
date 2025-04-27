class TokenList {
  values: Set<string>;

  constructor() {
    this.values = new Set<string>();
  }

  toString(): string {
    return Array.from(this.values).join(" ");
  }

  contains(token: string): boolean {
    return this.values.has(token);
  }

  add(...tokens: string[]): void {
    tokens.forEach((token) => this.values.add(token));
  }

  remove(token: string): void {
    this.values.delete(token);
  }

  get length(): number {
    return this.values.size;
  }
}

export default TokenList;
