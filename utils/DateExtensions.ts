interface Date {
	addDays(days: number): Date;
	validateDate(): boolean;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.validateDate = function() {
	const d = new Date(this);
	return !isNaN(d.getTime());
}