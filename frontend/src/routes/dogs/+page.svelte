<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<form action="/dogs/create" method="post" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md text-black">
    <h2 class="text-2xl font-semibold text-center mb-6">Add a Pet</h2>

    <div class="mb-4">
        <label for="name" class="block font-medium mb-2">Name</label>
        <input type="text" name="name" id="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <div class="mb-4">
        <label for="image" class="block font-medium mb-2">Image URL</label>
        <input type="text" name="image" id="image" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <div class="mb-4">
        <label for="hobby" class="block font-medium mb-2">Hobby</label>
        <input type="text" name="hobby" id="hobby" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <div class="mb-4">
        <label for="type" class="block font-medium mb-2">Type</label>
        <input type="text" name="type" id="type" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <div class="mb-4">
        <label for="breed" class="block font-medium mb-2">Breed</label>
        <input type="text" name="breed" id="breed" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <div class="mb-4">
        <label for="date_birth" class="block font-medium mb-2">Birth Date</label>
        <input type="date" name="date_birth" id="date_birth" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <div class="mb-4">
        <label for="date_death" class="block font-medium mb-2">Date of Death</label>
        <input type="date" name="date_death" id="date_death" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>

    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
</form>


