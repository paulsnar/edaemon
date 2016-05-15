# coding: utf-8

class lesson_utils(object):
    @staticmethod
    def process_form(form):
        # for the static thing
        subjects = [ ]
        for i in xrange(0, 9):
            subject = form.get('lesson-{0}'.format(i), None)
            if type(subject == unicode) and \
            subject == u'-' or subject == u'':
                subjects.append(None)
            else:
                subjects.append(subject)
        return subjects

def trim_trailing_nulls(lesson_list):
    new_list = list(lesson_list)
    for i in reversed(lesson_list):
        if i is None:
            new_list.pop(-1)
        else:
            break
    return new_list
