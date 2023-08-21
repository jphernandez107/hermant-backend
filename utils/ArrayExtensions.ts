interface Array<T> {
	max(): number;
	min(): number;
	minDate(): Date;
}

Array.prototype.max = function(): number {
	if (this.length === 0) return null;
	return Math.max.apply(null, this);
}

Array.prototype.min = function(): null {
	if (this.length === 0) return undefined
	return Math.min.apply(null, this);
};

Array.prototype.minDate = function(): Date {
	if (this.length === 0) return null;
	return new Date(Math.min(...this.map(date => date.getTime())));
}