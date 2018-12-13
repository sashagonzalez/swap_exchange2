# Here go your api methods.

try:
    import simplejson as json
except (ImportError,):
    import json

@auth.requires_signature()
def add_post():
    post_id = db.post.insert(
        post_title=request.vars.post_title,
        post_description=request.vars.post_description,
        post_price= request.vars.post_price,
        post_city=request.vars.post_city,
        post_image=request.vars.post_image,
        post_category=request.vars.post_category,
    )
    # We return the id of the new post, so we can insert it along all the others.
    return response.json(dict(post_id=post_id))


def get_post_list():
    results = []
    #use for limiting what a user who isnt logged in can see

        # Logged in.
        # rows = db().select(db.post.ALL, db.thumb.ALL,
        #                     left=[
        #                         db.thumb.on((db.thumb.post_id == db.post.id) & (db.thumb.user_email == auth.user.email)),
        #                     ],
        #                     orderby=~db.post.post_time)
    filter1 = request.vars.filter
    the_filter = json.loads(filter1)
    print(the_filter[0])
    if the_filter[0] == 'oldest':
        rows = db().select(db.post.ALL, orderby=db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_description=row.post_description,
                post_author=row.post_author,
                post_price=row.post_price,
                post_time=row.post_time,
                post_username=row.post_username,
                post_category=row.post_category,
                post_image=row.post_image,
                post_city=row.post_city
            ))

    elif the_filter[0] == 'newest':
        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_description=row.post_description,
                post_author=row.post_author,
                post_price=row.post_price,
                post_time=row.post_time,
                post_username=row.post_username,
                post_category=row.post_category,
                post_image=row.post_image,
                post_city=row.post_city
            ))

    elif the_filter[0] == 'cheapest':
        rows = db().select(db.post.ALL, orderby=~db.post.post_price)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_description=row.post_description,
                post_author=row.post_author,
                post_price=row.post_price,
                post_time=row.post_time,
                post_username=row.post_username,
                post_category=row.post_category,
                post_image=row.post_image,
                post_city=row.post_city
            ))

    elif the_filter[0] == 'expensive':
        rows = db().select(db.post.ALL, orderby=db.post.post_price)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_description=row.post_description,
                post_author=row.post_author,
                post_price=row.post_price,
                post_time=row.post_time,
                post_username=row.post_username,
                post_category=row.post_category,
                post_image=row.post_image,
                post_city=row.post_city
            ))

    elif the_filter:
        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            flag = False
            for search_filter in the_filter:
                if search_filter.lower() in row.post_title.lower():
                    flag = True
            if flag:
                results.append(dict(
                    id=row.id,
                    post_title=row.post_title,
                    post_description=row.post_description,
                    post_author=row.post_author,
                    post_price=row.post_price,
                    post_time=row.post_time,
                    post_username=row.post_username,
                    post_category=row.post_category,
                    post_image=row.post_image,
                    post_city=row.post_city
                ))

    elif the_filter[0] == '' or 'None':
        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_description=row.post_description,
                post_author=row.post_author,
                post_price=row.post_price,
                post_time=row.post_time,
                post_username=row.post_username,
                post_category=row.post_category,
                post_image=row.post_image,
                post_city=row.post_city
            ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(post_list=results))


def get_user_post_list():
    results = []
    #use for limiting what a user who isnt logged in can see
    if auth.user is None:
        # Not logged in.
        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_description=row.post_description,
                post_author=row.post_author,
                post_price=row.post_price,
                post_time=row.post_time,
                post_username=row.post_username,
                post_category=row.post_category,
                post_image=row.post_image,
                post_city=row.post_city
            ))
    else:
        # Logged in.
        # rows = db().select(db.post.ALL, db.thumb.ALL,
        #                     left=[
        #                         db.thumb.on((db.thumb.post_id == db.post.id) & (db.thumb.user_email == auth.user.email)),
        #                     ],
        #                     orderby=~db.post.post_time)

        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            if auth.user.username == row.post_username:
                results.append(dict(
                    id=row.id,
                    post_title=row.post_title,
                    post_description=row.post_description,
                    post_author=row.post_author,
                    post_price=row.post_price,
                    post_time=row.post_time,
                    post_username=row.post_username,
                    post_category=row.post_category,
                    post_image=row.post_image,
                    post_city=row.post_city
                ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(user_post_list=results))


def delete_post():
    
    post_id = request.vars.post_id
    db(db.post.id == post_id).delete()
    db(db.post_id.post_id == post_id).delete()
    db(db.question.question_post_id == post_id).delete()
    db(db.offer.offer_post_id == post_id).delete()
    
    return "ok"


def push_post_id():
    #define query
    dbrow = db(db.post_id.email == auth.user.email)
    #check if query found any entries
    if dbrow.count() > 0:
        
        #if so update that row
        row = dbrow.select().first().update_record(post_id=request.vars.post_id)
    else:
        
        #otherwise insert new row
        db.post_id.insert(
            post_id=request.vars.post_id
        )

def get_single_post():
    print("**********************************!!! in get single post")
    results = []
    #get id from post_id db
    row = db(db.post_id.email == auth.user.email).select().first()
    post_id=int(row.post_id)
    print("**********************************!!!post_id=",post_id)

    row = db(db.post.id == post_id).select().first()

    results.append(dict(
            id=row.id,
            post_title=row.post_title,
            post_description=row.post_description,
            post_author=row.post_author,
            post_price=row.post_price,
            post_time=row.post_time,
            post_username=row.post_username,
            post_category=row.post_category,
            post_image=row.post_image,
            post_city=row.post_city
    ))

    return response.json(dict(post_list=results))

def add_question():
    
    question_id = db.question.insert(
            question_post_id=request.vars.question_post_id,
            question_question=request.vars.question_question,
        )
    return response.json(dict(question_id=question_id))

def get_question_list():
    results = []
    rows = db(db.question.question_post_id == request.vars.post_id).select()

    for row in rows:
        if row.question_question is not '':
            results.append(dict(
                question=row.question_question,
                answer=row.question_answer,
                id = row.id,
        ))
    return response.json(dict(question_list=results))


def update_post():
    id = int(request.vars.post_id)
    title = request.vars.post_title
    description = request.vars.post_description
    price = request.vars.post_price
    city = request.vars.post_city
    image = request.vars.post_image
    db.post.update_or_insert(
            (db.post.id == id) & (db.post.post_author == auth.user.email),
            id = id,
            post_description = description,
            post_price = price,
            post_title = title,
            post_city = city,
            post_image = image,
        )
    return "ok"

def add_answer():
    print("********************in add_answer",request.vars.question_answer)
    query = db(db.question.id == request.vars.question_id)
    row = query.select().first()
    query.update(question_answer=request.vars.answer_content)
    print(row)
    # db.question.update_or_insert(
    #     (db.question.question_post_id == request.vars.question_id),
    #     #question_post_id=request.vars.question_post_id,
    #     question_question= row.question_question,
    #     question_answer=request.vars.question_answer,
    #     question_post_author_email = auth.user.email,
    #     question_post_author_username = auth.user.username,
    #     question_time = row.question_time,
    #     question_author_email = row.question_author_email,
    #     question_author_username = row.question_author_username,
    # )
    #return the id of the reply
    return "ok" #response.json(dict(=))

def add_offer():
    #otherwise insert new row
    db.offer.insert(
        offer_post_id=request.vars.post_id,
        offer_price=request.vars.price,
    )
    return "ok"

def get_offer_list():
    results =[]
    print("**************in get offer list")
    rows = db(db.offer.offer_post_id == request.vars.post_id).select()
    print("*****************",rows)
    for row in rows:
        results.append(dict(
            email=row.offer_user_email,
            price=row.offer_price,
            user=row.offer_user_username,
    ))
    print('********************')
    return response.json(dict(offers=results))