import { signInWithGoogle, signOutWithGoogle, useUserState} from "./firebase";
import {SignInButton, SignOutButton} from "../components/CourseList";


export const days = ['M', 'Tu', 'W', 'Th', 'F'];
export const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

export const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

export const toggle = (x, lst) => (
  lst.includes(x) ? lst.filter(y => x !== y) : [x, ...lst]
)

export const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
)

export const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

export const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

export const mapValues = (fn, obj) => (
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

export const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

export const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});


export const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

export const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

export const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

export const courseConflict = (course1, course2) => (
  getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);





export const TermButton = ({term, setTerm, checked}) => (
  <>
    <input type="radio" id={term} className="btn-check" autocomplete="off" checked={checked}
      onChange={() => setTerm(term)}/>
    <label class="btn btn-success m-1 p-2" htmlFor={term}> 
    {term}
    </label>
  </>
)
