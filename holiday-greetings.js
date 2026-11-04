(() => {
    const isSpanish = document.documentElement.lang.toLowerCase().startsWith('es');

    const nthWeekday = (year, month, weekday, nth) => {
        const first = new Date(year, month, 1).getDay();
        return 1 + (weekday - first + 7) % 7 + (nth - 1) * 7;
    };
    const lastWeekday = (year, month, weekday) => {
        const last = new Date(year, month + 1, 0);
        return last.getDate() - (last.getDay() - weekday + 7) % 7;
    };
    const electionDay = (year) => {
        const novFirst = new Date(year, 10, 1);
        const firstMonday = new Date(year, 10, 1 + ((8 - novFirst.getDay()) % 7));
        firstMonday.setDate(firstMonday.getDate() + 1);
        return firstMonday;
    };
    const easterSunday = (year) => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = (h + l - 7 * m + 114) % 31 + 1;
        return new Date(year, month - 1, day);
    };

    const curatedTodayInHistory = [
        { month: 1, day: 1, en: 'Today in history: New Year’s Day is a time for fresh beginnings and gratitude for the year ahead.', es: 'Hoy en la historia: el Año Nuevo es un momento para nuevos comienzos y gratitud por el año que comienza.' },
        { month: 1, day: 1, en: 'Happy New Year!', es: '¡Feliz Año Nuevo!' },
        { month: 2, day: 3, en: 'Today in history: The Four Chaplains were honored for their sacrifice during World War II.', es: 'Hoy en la historia: se honra el sacrificio de los Cuatro Capellanes durante la Segunda Guerra Mundial.' },
        { month: 3, day: 29, en: 'Today in history: National Vietnam War Veterans Day honors the service of those who fought in Vietnam.', es: 'Hoy en la historia: el Día Nacional de los Veteranos de la Guerra de Vietnam honra el servicio de quienes lucharon en Vietnam.' },
        { month: 4, day: 1, en: 'Today in history: April is the Month of the Military Child, honoring military children and families.', es: 'Hoy en la historia: abril es el Mes del Niño Militar, en honor a los niños y familias militares.' },
        { month: 5, day: 1, en: 'Today in history: Military Appreciation Month begins, recognizing those who serve and their families.', es: 'Hoy en la historia: comienza el Mes de Agradecimiento a las Fuerzas Armadas, reconociendo a quienes sirven y a sus familias.' },
        { month: 5, day: 25, en: 'Today in history: Memorial Day is observed to honor those who gave their lives in service to our country.', es: 'Hoy en la historia: el Día de los Caídos se observa para honrar a quienes dieron su vida al servicio de nuestro país.' },
        { month: 6, day: 6, en: 'Today in history: D-Day marked the Allied invasion of Normandy in 1944.', es: 'Hoy en la historia: el Día D marcó la invasión aliada de Normandía en 1944.' },
        { month: 6, day: 14, en: 'Today in history: The U.S. Army was established in 1775 and Flag Day is observed.', es: 'Hoy en la historia: el Ejército de los Estados Unidos se estableció en 1775 y se observa el Día de la Bandera.' },
        { month: 7, day: 4, en: 'Today in history: The Declaration of Independence was adopted in 1776.', es: 'Hoy en la historia: la Declaración de Independencia fue adoptada en 1776.' },
        { month: 7, day: 27, en: 'Today in history: The Korean War armistice was signed in 1953.', es: 'Hoy en la historia: se firmó el armisticio de la Guerra de Corea en 1953.' },
        { month: 8, day: 4, en: 'Today in history: The U.S. Coast Guard was founded in 1790.', es: 'Hoy en la historia: la Guardia Costera de los Estados Unidos se fundó en 1790.' },
        { month: 8, day: 7, en: 'Today in history: Purple Heart Day honors recipients of the Purple Heart medal.', es: 'Hoy en la historia: el Día del Corazón Púrpura honra a los receptores de la medalla del Corazón Púrpura.' },
        { month: 9, day: 11, en: 'Today in history: Patriot Day honors the lives lost and the courage shown on September 11, 2001.', es: 'Hoy en la historia: el Día del Patriota honra las vidas perdidas y el valor mostrado el 11 de septiembre de 2001.' },
        { month: 9, day: 18, en: 'Today in history: The U.S. Air Force was established in 1947.', es: 'Hoy en la historia: la Fuerza Aérea de los Estados Unidos se estableció en 1947.' },
        { month: 10, day: 13, en: 'Today in history: The U.S. Navy was established in 1775.', es: 'Hoy en la historia: la Armada de los Estados Unidos se estableció en 1775.' },
        { month: 11, day: 10, en: 'Today in history: The U.S. Marine Corps was founded in 1775.', es: 'Hoy en la historia: el Cuerpo de Marines de los Estados Unidos se fundó en 1775.' },
        { month: 11, day: 11, en: 'Today in history: Veterans Day honors all who have served in the U.S. Armed Forces.', es: 'Hoy en la historia: el Día de los Veteranos honra a todos los que han servido en las Fuerzas Armadas de los Estados Unidos.' },
        { month: 11, day: 11, en: 'Happy Veterans Day. With gratitude, we honor all who have served in the U.S. Armed Forces.', es: 'Feliz Día de los Veteranos. Con gratitud, honramos a quienes han servido en las Fuerzas Armadas de los Estados Unidos.' },
        { month: 11, day: 16, en: 'Today in history: The first known observance of a Thanksgiving-style harvest celebration took place in North America.', es: 'Hoy en la historia: se celebró una de las primeras festividades de agradecimiento de cosecha en América del Norte.' },
        { month: 11, day: 28, en: 'Today in history: Thanksgiving is a time to give thanks for family, friends, and community.', es: 'Hoy en la historia: el Día de Acción de Gracias es un momento para dar gracias por la familia, los amigos y la comunidad.' },
        { month: 12, day: 7, en: 'Today in history: Pearl Harbor was attacked in 1941, a day of remembrance for service members and civilians.', es: 'Hoy en la historia: Pearl Harbor fue atacado en 1941, un día de recuerdo para miembros del servicio y civiles.' },
        { month: 12, day: 13, en: 'Today in history: The National Guard traces its roots to 1636.', es: 'Hoy en la historia: la Guardia Nacional remonta sus raíces a 1636.' },
        { month: 12, day: 20, en: 'Today in history: The U.S. Space Force was established in 2019.', es: 'Hoy en la historia: la Fuerza Espacial de los Estados Unidos se estableció en 2019.' },
        { month: 12, day: 25, en: 'Today in history: Christmas celebrates the birth of Jesus Christ and the spirit of peace, hope, and goodwill.', es: 'Hoy en la historia: la Navidad celebra el nacimiento de Jesucristo y el espíritu de paz, esperanza y bondad.' },
        { month: 12, day: 25, en: 'Merry Christmas!', es: '¡Feliz Navidad!' }
    ];

    const getEvents = (year) => {
        const events = [];
        const fixed = (month, day, en, es, category = 'holiday') => {
            events.push({ date: new Date(year, month - 1, day), en, es, category });
        };
        const weekday = (month, dayOfWeek, occurrence, en, es, category = 'observance') => {
            events.push({ date: new Date(year, month - 1, nthWeekday(year, month - 1, dayOfWeek, occurrence)), en, es, category });
        };
        const last = (month, dayOfWeek, en, es, category = 'observance') => {
            events.push({ date: new Date(year, month - 1, lastWeekday(year, month - 1, dayOfWeek)), en, es, category });
        };

        fixed(1, 1, 'Happy New Year!', '¡Feliz Año Nuevo!');
        const election = electionDay(year);
        events.push({ date: election, en: 'Happy Election Day! We encourage every eligible voter to participate.', es: '¡Feliz Día de la Elección! Animamos a cada votante elegible a participar.', category: 'observance' });
        weekday(1, 1, 3, 'Happy Martin Luther King Jr. Day.', 'Feliz Día de Martin Luther King Jr.');
        weekday(2, 1, 3, 'Happy Presidents Day.', 'Feliz Día de los Presidentes.');
        fixed(2, 14, 'Happy Valentine’s Day!', '¡Feliz Día de San Valentín!');
        fixed(2, 3, 'We honor the Four Chaplains and their sacrifice during World War II.', 'Honramos a los Cuatro Capellanes y su sacrificio durante la Segunda Guerra Mundial.', 'military');
        fixed(3, 17, 'Happy St. Patrick’s Day!', '¡Feliz Día de San Patricio!');
        fixed(3, 29, 'We honor and thank our Vietnam War veterans.', 'Honramos y agradecemos a nuestros veteranos de la Guerra de Vietnam.', 'military');
        const easter = easterSunday(year);
        events.push({ date: easter, en: 'Happy Easter!', es: '¡Felices Pascuas!', category: 'holiday' });
        const mothersDay = new Date(year, 4, nthWeekday(year, 4, 0, 2));
        events.push({ date: mothersDay, en: 'Happy Mother’s Day!', es: '¡Feliz Día de las Madres!', category: 'holiday' });
        const spouseDay = new Date(mothersDay);
        spouseDay.setDate(spouseDay.getDate() - 7);
        events.push({ date: spouseDay, en: 'We recognize and thank military spouses for their service and support.', es: 'Reconocemos y agradecemos a los cónyuges militares por su servicio y apoyo.', category: 'military' });
        fixed(4, 5, 'We honor Gold Star spouses and the families of the fallen.', 'Honramos a los cónyuges Gold Star y a las familias de los caídos.', 'military');
        events.push({ date: new Date(year, 3, 1), en: 'April is the Month of the Military Child. We honor military children and families.', es: 'Abril es el Mes del Niño Militar. Honramos a los niños militares y sus familias.', category: 'military-month' });
        fixed(5, 1, 'May is Military Appreciation Month. We honor all who serve and their families.', 'Mayo es el Mes de Agradecimiento a las Fuerzas Armadas. Honramos a quienes sirven y a sus familias.', 'military-month');
        weekday(5, 6, 3, 'Happy Armed Forces Day. Thank you to all who serve on active duty.', 'Feliz Día de las Fuerzas Armadas. Gracias a quienes están en servicio activo.', 'military');
        last(5, 1, 'On Memorial Day, we remember and honor those who gave their lives in service to our country.', 'En el Día de los Caídos, recordamos y honramos a quienes dieron su vida al servicio de nuestro país.', 'military');
        fixed(6, 6, 'We remember the service and sacrifice of those who took part in D-Day.', 'Recordamos el servicio y sacrificio de quienes participaron en el Día D.', 'military');
        fixed(6, 14, 'Happy U.S. Army Birthday and Flag Day!', '¡Feliz aniversario del Ejército de los Estados Unidos y Día de la Bandera!', 'military');
        fixed(6, 19, 'Happy Juneteenth.', 'Feliz Juneteenth.');
        const fathersDay = new Date(year, 5, nthWeekday(year, 5, 0, 3));
        events.push({ date: fathersDay, en: 'Happy Father’s Day!', es: '¡Feliz Día del Padre!', category: 'holiday' });
        fixed(7, 4, 'Happy Independence Day!', '¡Feliz Día de la Independencia!');
        fixed(7, 27, 'We remember Korean War veterans and the anniversary of the armistice.', 'Recordamos a los veteranos de la Guerra de Corea y el aniversario del armisticio.', 'military');
        fixed(8, 4, 'Happy U.S. Coast Guard Birthday!', '¡Feliz aniversario de la Guardia Costera de los Estados Unidos!', 'military');
        fixed(8, 7, 'We honor all Purple Heart recipients.', 'Honramos a quienes han recibido el Corazón Púrpura.', 'military');
        fixed(8, 14, 'We remember the service and sacrifice of those who served in World War II.', 'Recordamos el servicio y sacrificio de quienes sirvieron en la Segunda Guerra Mundial.', 'military');
        weekday(9, 1, 1, 'Happy Labor Day!', '¡Feliz Día del Trabajo!');
        fixed(9, 11, 'We remember the victims, survivors, and heroes of September 11.', 'Recordamos a las víctimas, sobrevivientes y héroes del 11 de septiembre.', 'military');
        weekday(9, 5, 3, 'We honor our nation’s prisoners of war and those missing in action.', 'Honramos a los prisioneros de guerra y a quienes están desaparecidos en combate.', 'military');
        fixed(9, 18, 'Happy U.S. Air Force Birthday!', '¡Feliz aniversario de la Fuerza Aérea de los Estados Unidos!', 'military');
        last(9, 0, 'We honor Gold Star Mothers and families who have lost a loved one in military service.', 'Honramos a las madres y familias Gold Star que han perdido a un ser querido en el servicio militar.', 'military');
        fixed(10, 13, 'Happy U.S. Navy Birthday!', '¡Feliz aniversario de la Armada de los Estados Unidos!', 'military');
        fixed(10, 31, 'Happy Halloween!', '¡Feliz Halloween!');
        events.push({ date: new Date(year, 10, 1), en: 'November is National Veterans and Military Families Month. We honor veterans, service members, and their families.', es: 'Noviembre es el Mes Nacional de los Veteranos y las Familias Militares. Honramos a los veteranos, miembros del servicio y sus familias.', category: 'military-month' });
        fixed(11, 10, 'Happy U.S. Marine Corps Birthday!', '¡Feliz aniversario del Cuerpo de Marines de los Estados Unidos!', 'military');
        fixed(11, 11, 'Happy Veterans Day. With gratitude, we honor all who have served in the U.S. Armed Forces.', 'Feliz Día de los Veteranos. Con gratitud, honramos a quienes han servido en las Fuerzas Armadas de los Estados Unidos.', 'military');
        weekday(11, 4, 4, 'Happy Thanksgiving!', '¡Feliz Día de Acción de Gracias!');
        fixed(12, 7, 'We remember and honor those who served and died at Pearl Harbor.', 'Recordamos y honramos a quienes sirvieron y murieron en Pearl Harbor.', 'military');
        fixed(12, 13, 'Happy National Guard Birthday!', '¡Feliz aniversario de la Guardia Nacional!', 'military');
        fixed(12, 20, 'Happy U.S. Space Force Birthday!', '¡Feliz aniversario de la Fuerza Espacial de los Estados Unidos!', 'military');
        fixed(12, 25, 'Merry Christmas!', '¡Feliz Navidad!');
        fixed(12, 31, 'Wishing you a safe and happy New Year’s Eve!', '¡Le deseamos una Nochevieja segura y feliz!');

        return events;
    };

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const matches = curatedTodayInHistory.filter((entry) => entry.month === month && entry.day === day);
    const holidays = getEvents(today.getFullYear()).filter((event) =>
        event.date.getFullYear() === today.getFullYear() &&
        event.date.getMonth() === today.getMonth() &&
        event.date.getDate() === today.getDate()
    );

    const combined = [...matches, ...holidays].map((item) => isSpanish ? item.es : item.en);
    const unique = [...new Set(combined)];
    if (!unique.length) return;

    const banner = document.createElement('aside');
    banner.className = 'holiday-greeting';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = 'background:#f8f6f1;color:#1a2b4a;border-bottom:3px solid #c5a253;text-align:center;padding:14px 20px;font-weight:600;font-size:1.05rem;';
    banner.textContent = unique.join(' ');
    const header = document.querySelector('.site-header');
    if (header) header.insertAdjacentElement('afterend', banner);
})();
