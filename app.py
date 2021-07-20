"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()


@app.route('/')
def homepage():
    """Renders homepage template."""
    
    return render_template('index.html')

@app.route('/api/cupcakes')
def list_cupcakes():
    """Returns data of all cupcakes.
    
    Responds with JSON like: 
        {cupcakes: [{id, flavor, size, rating, image}, ...]}.
    """
    
    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]
    
    return jsonify(cupcakes=serialized)


@app.route('/api/cupcakes/<int:cupcake_id>')
def get_cupcake(cupcake_id):
    """Returns data on a specific cupcake.
    
    Responds with JSON like: 
        {cupcake: {id, flavor, size, rating, image}}.
    """
    
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()
    
    return jsonify(cupcake=serialized)


@app.route('/api/cupcakes', methods=["POST"])
def add_cupcake():
    """Create cupcake from request data.
    
    Responds with JSON like: 
        {cupcake: {id, flavor, size, rating, image}}.
    """
    
    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json["image"] or None
    
    new_cupcake = Cupcake(flavor=flavor, 
                          size=size,
                          rating=rating,
                          image=image)
    # can also just directly assign in instantiation
    
    db.session.add(new_cupcake)
    db.session.commit()
    
    serialized = new_cupcake.serialize()
    
    return (jsonify(cupcake=serialized), 201)


@app.route('/api/cupcakes/<int:cupcake_id>', methods=["PATCH"])
def update_cupcake(cupcake_id):
    """Updates data on a specific cupcake.
    
    Respond with JSON of the newly-updated cupcake, like this: 
        {cupcake: {id, flavor, size, rating, image}}.
    """

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    
    # updates each attribute on the cupcake instance directly 
    # with the data from the body of the request
    # the attributes that were not changed will remain the same
    cupcake.flavor = request.json.get("flavor", cupcake.flavor)
    cupcake.size = request.json.get("size", cupcake.size)
    cupcake.rating = request.json.get("rating", cupcake.rating)
    cupcake.image = request.json.get("image", cupcake.image)
    # cupcake.flavor = request.json["flavor"]
    # cupcake.size = request.json["size"]
    # cupcake.rating = request.json["rating"]
    # cupcake.image = request.json["image"]
    
    db.session.commit() 
    
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes/<int:cupcake_id>', methods=["DELETE"])
def delete_cupcake(cupcake_id):
    """Deletes data on a specific cupcake.
    
    Respond with JSON like {message: "Deleted"}.
    """    
    
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    
    db.session.delete(cupcake)
    db.session.commit()
    
    return jsonify(message="Deleted")

@app.route('/api/search')
def search_cupcake():
    """Returns all cupcakes with a flavor that is like 
    the one in the search term.
    """
    
    term = request.args["term"].capitalize()
    
    cupcakes = Cupcake.query.filter(Cupcake.flavor.like(f'%{term}%')).all()
    serialized = [c.serialize() for c in cupcakes]
    
    return jsonify(cupcakes=serialized)