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

        // U.S. holidays and widely observed seasonal greetings.
        fixed(1, 1, 'Happy New Year!', '¡Feliz Año Nuevo!');
        weekday(1, 1, 3, 'Happy Martin Luther King Jr. Day.', 'Feliz Día de Martin Luther King Jr.');
        weekday(2, 1, 3, 'Happy Presidents Day.', 'Feliz Día de los Presidentes.');
        fixed(2, 14, 'Happy Valentine’s Day!', '¡Feliz Día de San Valentín!');
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
        fixed(11, 10, 'Happy U.S. Marine Corps Birthday!', '¡Feliz aniversario del Cuerpo de Marines de los Estados Unidos!', 'military');
        fixed(11, 11, 'Happy Veterans Day. With gratitude, we honor all who have served in the U.S. Armed Forces.', 'Feliz Día de los Veteranos. Con gratitud, honramos a quienes han servido en las Fuerzas Armadas de los Estados Unidos.', 'military');
        weekday(11, 4, 4, 'Happy Thanksgiving!', '¡Feliz Día de Acción de Gracias!');
        fixed(12, 7, 'We remember and honor those who served and died at Pearl Harbor.', 'Recordamos y honramos a quienes sirvieron y murieron en Pearl Harbor.', 'military');
        fixed(12, 13, 'Happy National Guard Birthday!', '¡Feliz aniversario de la Guardia Nacional!', 'military');
        fixed(12, 20, 'Happy U.S. Space Force Birthday!', '¡Feliz aniversario de la Fuerza Espacial de los Estados Unidos!', 'military');
        fixed(12, 25, 'Merry Christmas!', '¡Feliz Navidad!');
        fixed(12, 31, 'Wishing you a safe and happy New Year’s Eve!', '¡Le deseamos una Nochevieja segura y feliz!');

        // Four Chaplains Day, observed annually on February 3.
        fixed(2, 3, 'We honor the Four Chaplains and their sacrifice during World War II.', 'Honramos a los Cuatro Capellanes y su sacrificio durante la Segunda Guerra Mundial.', 'military');
        // Military Appreciation Month and Month of the Military Child are month-long recognitions.
        events.push({ date: new Date(year, 3, 1), en: 'April is the Month of the Military Child. We honor military children and families.', es: 'Abril es el Mes del Niño Militar. Honramos a los niños militares y sus familias.', category: 'military-month' });
        events.push({ date: new Date(year, 10, 1), en: 'November is National Veterans and Military Families Month. We honor veterans, service members, and their families.', es: 'Noviembre es el Mes Nacional de los Veteranos y las Familias Militares. Honramos a los veteranos, miembros del servicio y sus familias.', category: 'military-month' });
        return events;
    };

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const todaysEvents = getEvents(today.getFullYear()).filter((event) =>
        event.date.getFullYear() === today.getFullYear() &&
        event.date.getMonth() === today.getMonth() &&
        event.date.getDate() === today.getDate()
    );
    if (!todaysEvents.length) return;

    const messages = [...new Set(todaysEvents.map((event) => isSpanish ? event.es : event.en))];
    const banner = document.createElement('aside');
    banner.className = 'holiday-greeting';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = 'background:#f8f6f1;color:#1a2b4a;border-bottom:3px solid #c5a253;text-align:center;padding:14px 20px;font-weight:600;font-size:1.05rem;';
    banner.textContent = messages.join(' ');
    const header = document.querySelector('.site-header');
    if (header) header.insertAdjacentElement('afterend', banner);
})();
