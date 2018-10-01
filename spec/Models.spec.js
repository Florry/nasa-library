const SearchQuery = require("../lib/models/SearchQuery");
const UserModel = require("../lib/models/UserModel");
const uuid = require("uuid");

describe("Models", () => {

    describe("SearchQuery", () => {

        it("should return query string based on class' variables", done => {
            try {
                const searchQuery = new SearchQuery({
                    q: "q",
                    center: "center",
                    description: "description",
                    description_508: "description_508",
                    keywords: "keywords",
                    location: "location",
                    media_type: "media_type",
                    nasa_id: "nasa_id",
                    photographer: "photographer",
                    secondary_creator: "secondary_creator",
                    title: "title",
                    year_start: "year_start",
                    year_end: "year_end",
                    page: 12,
                });

                const queryString = searchQuery.toQueryString();

                expect(queryString)
                    .toBe("?q=q&center=center&description=description&description_508=description_508&keywords=keywords&location=location&media_type=media_type&nasa_id=nasa_id&photographer=photographer&secondary_creator=secondary_creator&title=title&year_start=year_start&year_end=year_end&page=12",
                        "Query string");

                done();
            } catch (err) {
                console.error(err);
                done.fail(err);
            }
        });

        it("should set page automatically if none was provided", done => {
            try {
                const searchQuery = new SearchQuery({
                    q: "q",
                    center: "center",
                    description: "description",
                    description_508: "description_508",
                    keywords: "keywords",
                    location: "location",
                    media_type: "media_type",
                    nasa_id: "nasa_id",
                    photographer: "photographer",
                    secondary_creator: "secondary_creator",
                    title: "title",
                    year_start: "year_start",
                    year_end: "year_end"
                });

                expect(searchQuery.page).toBe(1);

                done();
            } catch (err) {
                console.error(err);
                done.fail(err);
            }
        });

    });

    describe("UserModel", () => {

        it("should generate new id if none is provided", done => {
            try {
                const username = "username";
                const created = new Date();

                const userModel = new UserModel(username, uuid.v4(), uuid.v4(), created);

                expect(userModel.username).toBe(username, "userModel.username");
                expect(userModel.id).toBeDefined();
                expect(
                    new RegExp("[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}")
                        .test(userModel.id)
                )
                    .toBeTruthy("generated id should be uuid");

                done();
            } catch (err) {
                console.error(err);
                done.fail(err);
            }
        });

        it("should add created date if none is provided", done => {
            try {
                const username = "username";
                const userModel = new UserModel(username, uuid.v4(), uuid.v4());

                expect(userModel.username).toBe(username, "userModel.username");
                expect(userModel.metadata).toBeDefined();
                expect(userModel.metadata.created).toBeDefined();
                expect(userModel.metadata.created instanceof Date).toBeTruthy("should be Date object");
                expect(userModel.id).toBeDefined();

                done();
            } catch (err) {
                console.error(err);
                done.fail(err);
            }
        });

        it("should be possible to convert to view model", done => {
            try {
                const id = uuid.v4();
                const username = "username";
                const created = new Date();

                const userModel = new UserModel(username, uuid.v4(), uuid.v4(), created, id);
                const viewModel = userModel.toViewModel();

                expect(Object.keys(viewModel).length).toBe(3, "Object.keys(viewModel).length");

                expect(viewModel.id).toBe(id, "viewModel.id");
                expect(viewModel.metadata).toBeDefined("viewModel.metadata");
                expect(viewModel.metadata.created).toBe(created, "viewModel.metadata.created");

                done();
            } catch (err) {
                console.error(err);
                done.fail(err);
            }
        });


    });

});