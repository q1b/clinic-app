import { Temporal } from "@js-temporal/polyfill";

export const getNums = (input:string,sep:"-"|":") => input.split(sep).map((v) => +`${v}`) || [];

// get 2023-11-24 to PlainDate Object
export function getPlainDate({year,month,day}:{year:number,month:number,day:number}) {
	let is12 = false;
	if (month === 12) {
		month = 11;
		is12 = true;
	}
  console.log(year,month,day)
	let today = new Temporal.PlainDate(year, month, day);
  if(is12) {
    today = today.add({
      months: 1
    });
  }
  return today
}

export function getPlainDateTime({year, month, day, hour, minute}:{year:number;month:number;day:number;hour:number;minute:number}) {
	let is12 = false;
	if (month === 12) {
		month = 11;
		is12 = true;
	}
	let today = new Temporal.PlainDateTime(year, month, day,hour,minute);
  if(is12) {
    today = today.add({
      months: 1
    });
  }
  return today
}