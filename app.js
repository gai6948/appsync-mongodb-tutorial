const { MongoClient } = require('mongodb');

exports.lambdaHandler = async (event, context, callback) => {
    const listOfMovies = [];
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    switch(event.field) {
        case "getMoviesByTitle":
            try {
                const title = event.arguments.title;
                await client.connect();
                const cursor = client.db('appsync-db').collection('movies').find({
                    title: title
                });
                const results = await cursor.toArray();
                if (results.length > 0) {
                    results.forEach((result) => {
                        listOfMovies.push({
                            id: result._id,
                            title: result.title,
                            year: result.year,
                            director: result.director,
                            genres: result.genres,
                            actors: result.actors
                        });
                    });
                }
                await client.close()
                callback(null, listOfMovies);
                break;
            } catch (err) {
                console.log(err);
                await client.close()
                callback(null, err);
                break;
            }
        case "getMoviesByActor":
            let actor = '';
            try {
                actor = event.source;
                console.log(actor);
                const listOfMovies = [];
                await client.connect();
                const cursor = client.db('appsync-db').collection('movies').find({
                    actors: actor
                });
                const results = await cursor.toArray();
                if (results.length > 0) {
                    results.forEach((result) => {
                        listOfMovies.push({
                            id: result._id,
                            title: result.title,
                            year: result.year,
                            director: result.director,
                            genres: result.genres,
                            actors: result.actors
                        });
                    });
                }
                await client.close()
                callback(null, listOfMovies);
                break;
            } catch (err) {
                console.log(err);
                await client.close()
                callback(null, err);
                break;
            }
        case "getMoviesByGenre":
            try {
                const genre = event.arguments.genre
                await client.connect();
                const cursor = client.db('appsync-db').collection('movies').find({
                    genres: genre
                });
                const results = await cursor.toArray();
                if (results.length > 0) {
                    results.forEach((result) => {
                        listOfMovies.push({
                            id: result._id,
                            title: result.title,
                            year: result.year,
                            director: result.director,
                            genres: result.genres,
                            actors: result.actors
                        });
                    });
                }
                await client.close()
                callback(null, listOfMovies);
                break;
            } catch (err) {
                console.log(err);
                await client.close()
                callback(null, err);
                break;
            }
        case "actorsInMovie":
            const title = event.source.title;
            let listOfActors = []
            console.log(title);
            try {
                await client.connect();
                const cursor = client.db('appsync-db').collection('movies').find({
                    title: title 
                }).project({
                    _id: 0,
                    actors: 1
                });
                const results = await cursor.toArray();
                listOfActors = results[0].actors;
                console.log(listOfActors);
                await client.close()
                callback(null, listOfActors);
                break;
            } catch (err) {
                console.log(err);
                await client.close()
                callback(null, err);
                break;
            }
        default:
            console.log("Unknown field");
            callback("Unknown field, unable to resolve " + event.field, null);
            break;
    }
};
