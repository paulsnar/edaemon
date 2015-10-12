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

class _ClassName(object):
    def __init__(self, className, change):
        self.className = className
        self.change = change

def extract_unique_classname_objects(changes):
    classNames = set()
    _classnameObjects = dict()
    _iterateds = set()
    for change in changes:
        if change.className in classNames and \
        not change.className in _iterateds:
            del _classnameObjects[change.className]
            classNames.add(change.className)
            _iterateds.add(change.className)
            datemap = dict()
            for change in changes:
                datemap[change.date] = change
            _keys = sorted(datemap.keys())
            _classnameObjects[change.className] = _ClassName(
                # take the earliest by date
                change.className, datemap[_keys[0]])
        else:
            classNames.add(change.className)
            _classnameObjects[change.className] = _ClassName(
                change.className, change)
    _sortedClassnames = sorted(_classnameObjects.keys())
    return [_classnameObjects[x] for x in _sortedClassnames]

def extract_dates(changes):
    dates = set()
    for change in changes:
        dates.add(change.date)
    return dates

def create_week_formatted():
    days = [ ]
    today = date.today()
    day = timedelta(days=1)
    for i in xrange(0, 7):
        days.append(format_date_ISO8601(today + day * i))
    return days
