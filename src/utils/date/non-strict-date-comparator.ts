/**
 *
 * Compares two dates to see if they are the same year, month, day, hour, and minute.
 * Does not compare seconds or milliseconds.
 *
 * @param a left date
 * @param b right date
 * @returns `boolean` if the dates are the same year, month, day, hour, and minute
 */
export const looseIsDateEqual = (a: Date, b: Date) => {
  const sameYear = a.getFullYear() === b.getFullYear();
  const sameMonth = a.getMonth() === b.getMonth();
  const sameDay = a.getDate() === b.getDate();
  const sameHour = a.getHours() === b.getHours();
  const sameMinute = a.getMinutes() === b.getMinutes();

  return sameYear && sameMonth && sameDay && sameHour && sameMinute;
};

/**
 *
 * Compares two dates to see if the left date is before the right date.
 * Does not compare seconds or milliseconds.
 *
 * @param leftDate left date
 * @param rightDate right date
 * @returns `boolean` if the left date is before the right date
 */
export const looseIsDateBefore = (leftDate: Date, rightDate: Date) => {
  if (leftDate.getFullYear() > rightDate.getFullYear()) {
    return false;
  } else if (leftDate.getFullYear() < rightDate.getFullYear()) {
    return true;
  }

  // year is equal
  if (leftDate.getMonth() > rightDate.getMonth()) {
    return false;
  } else if (leftDate.getMonth() < rightDate.getMonth()) {
    return true;
  }

  // year and month are equal
  if (leftDate.getDate() > rightDate.getDate()) {
    return false;
  } else if (leftDate.getDate() < rightDate.getDate()) {
    return true;
  }

  // year, month, and day are equal
  if (leftDate.getHours() > rightDate.getHours()) {
    return false;
  } else if (leftDate.getHours() < rightDate.getHours()) {
    return true;
  }

  // year, month, day, and hour are equal
  if (leftDate.getMinutes() > rightDate.getMinutes()) {
    return false;
  } else if (leftDate.getMinutes() < rightDate.getMinutes()) {
    return true;
  }

  // year, month, day, hour, and minute are equal
  return false;
};

/**
 *
 * Compares two dates to see if the left date is after the right date.
 * Does not compare seconds or milliseconds.
 *
 * @param leftDate left date
 * @param rightDate right date
 * @returns `boolean` if the left date is after the right date
 */
export const looseIsDateAfter = (leftDate: Date, rightDate: Date) => {
  if (leftDate.getFullYear() < rightDate.getFullYear()) {
    return false;
  } else if (leftDate.getFullYear() > rightDate.getFullYear()) {
    return true;
  }

  // year is equal
  if (leftDate.getMonth() < rightDate.getMonth()) {
    return false;
  } else if (leftDate.getMonth() > rightDate.getMonth()) {
    return true;
  }

  // year and month are equal
  if (leftDate.getDate() < rightDate.getDate()) {
    return false;
  } else if (leftDate.getDate() > rightDate.getDate()) {
    return true;
  }

  // year, month, and day are equal
  if (leftDate.getHours() < rightDate.getHours()) {
    return false;
  } else if (leftDate.getHours() > rightDate.getHours()) {
    return true;
  }

  // year, month, day, and hour are equal
  if (leftDate.getMinutes() < rightDate.getMinutes()) {
    return false;
  } else if (leftDate.getMinutes() > rightDate.getMinutes()) {
    return true;
  }

  // year, month, day, hour, and minute are equal
  return false;
};
