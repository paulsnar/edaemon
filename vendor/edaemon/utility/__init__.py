from datetime import date, timedelta

def parse_change_subjects(_s):
    subjectsobj = _s
    for i in reversed(subjectsobj):
        if i is None:
            subjectsobj.pop(-1)
        else:
            break
    if subjectsobj is None:
        return []
    else:
        return subjectsobj

def parse_timetable_subjects(_s):
    for i, val in enumerate(_s):
        _s[i] = parse_change_subjects(val)
    return _s

def parse_change_subjects_for_form(_s):
    subjectsobj = parse_change_subjects(_s)
    for i, val in enumerate(subjectsobj):
        if val is None:
            subjectsobj[i] = '-'
    return subjectsobj

def parse_change_subjects_from_form(form):
    subjects = []
    for i in xrange(0, 9):
        _subject = form.get('subject_{0}'.format(i), None)
        if type(_subject) == unicode and \
        _subject == u'-' or _subject == u'':
            subjects.append(None)
        else:
            subjects.append(_subject)
    return subjects

def format_date_ISO8601(formattableDate):
    return '{0:0>#4}-{1:0>#2}-{2:0>#2}'.format(
        formattableDate.year, formattableDate.month, formattableDate.day)

def extract_unique_classnames(changes):
    classNames = set()
    for change in changes:
        classNames.add(change.className)
    return classNames # sets should be regularly iteratable

def create_week_formatted():
    days = [ ]
    today = date.today()
    day = timedelta(days=1)
    for i in xrange(0, 7):
        days.append(format_date_ISO8601(today + day * i))
    return days
