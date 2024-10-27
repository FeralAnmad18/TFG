export class DateManager {
    constructor() {
      this.dates = [];
    }
  
    getAllDates() {
      return this.dates;
    }
  
    addDate(newDate) {
      if (!this.dates.includes(newDate)) {
        this.dates.push(newDate);
      }
    }
  
    removeDate(dateToRemove) {
      this.dates = this.dates.filter(date => date !== dateToRemove);
    }
  
    findDate(dateToFind) {
      return this.dates.includes(dateToFind);
    }
  }
  