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
