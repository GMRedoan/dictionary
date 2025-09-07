//  synonyms load
 const createElement =(arr)=>{
    const htmlElements = arr.map(el => `<span class="btn bg-[#d7e4ef]">${el}</span>`)
    return htmlElements.join(" ")
  }

//   sound
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


//   loading 
const loading = (status) =>{
    if(status == true){
        document.getElementById('spin').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    }
    else{
        document.getElementById('word-container').classList.remove('hidden')
        document.getElementById('spin').classList.add('hidden')
     }
}

  // display the btn of level
 const loadData = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayData(json.data))
 }

//  remove the previous color of btn
 const removeActive = () => {
    const activeBtns = document.querySelectorAll(".lesson-btn")
    //  activeBtns.forEach((btn) => btn.classList.remove('active'))
    for(activeBtn of activeBtns){
        activeBtn.classList.remove('active')
    }
  }

//  details about word
 const loadDetails = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => displayDetails(data.data))
 }

 const displayDetails = (word) => {
    const detailsContainer = document.getElementById('details-container')
    detailsContainer.innerHTML = ` 
    <h3 class="text-[34px] font-semibold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})</h3>
    <p class="font-semibold tetx-[26px] mt-[7px] text-gray-500">Meaning</p>
    <p class="text-[24px] font-bangla font-medium mb-[10px]">${word.meaning}</p>
    <p class="text-[24px] font-semibold">Example</p>
    <p class="text-[20px] text-gray-500">${word.sentence}</p>
    <p class="text-[18px] font-medium font-bangla mt-[10px]">সমার্থক শব্দ গুলো</p>
    <div class="">
    ${createElement(word.synonyms)}
        </div>

    `;
    document.getElementById('my_modal_5').showModal();

  }

//   show the clicked level words
 const loadLevelWord = (id) => {
    loading(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(json => {
        removeActive()
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add('active')
        displayWord(json.data)
    })
   }
    const displayWord = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = "";
// if level is empty
    if(words.length == 0){
        wordContainer.innerHTML = `
                <div class="p-[40px] text-center col-span-full">
                <img class="mx-auto" src="assets/alert-error.png" alt="">
                 <p class="text-gray-500 text-[18px] font-bangla mb-[15px]">
                    এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। 
                </p>
                <h3 class="text-[32px] font-medium font-bangla">
                    নেক্সট Lesson এ যান
                </h3>
            </div>
         `
         loading(false)
         return 
     }
// .................null or undefined solution.............. 
    for(let word of words){
        const wordDiv = document.createElement("div")
        wordDiv.innerHTML = `
            <div class="bg-white rounded-[10px] p-[20px] py-[40px] shadow-lg sm:mb-[0px] md: mb-[20px]">
            <div class="text-center">
                <h2 class="text-[21px] font-semibold">${word.word ? word.word : "Missing"}</h2>
                <p>Meaning /Pronounciation</p>
                <p class="text-[22px] mt-[10px] text-gray-700 font-bangla font-medium">${word.meaning ? word.meaning : "Missing"}</p>
                <div class="flex justify-between mt-[30px]">
                    <button onclick="loadDetails(${word.id})" class="p-[10px] rounded-[10px] bg-[#1a91ff1a]"><i class="fa-solid fa-circle-info "></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="p-[10px] rounded-[10px] bg-[#1a91ff1a]"><i class="fa-solid fa-volume-high "></i></button>
                </div>
             </div>
            </div>
           `
        wordContainer.appendChild(wordDiv);
    }
    loading(false)
   }
// display the btn of level
 const displayData = (lessons) => {
      const levelContainer = document.getElementById('level-container')
      levelContainer.innerHTML = "";
      for(let lesson of lessons){
        const btnDiv = document.createElement("div")
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onClick = "loadLevelWord(${lesson.level_no})" class="border-[1.5px] border-[#422ad5] px-[10px] py-[10px] mr-[10px] rounded-[5px] text-[#422ad5] font-medium hover:bg-[#422ad5] hover:text-white lesson-btn "><i class="fa-brands fa-leanpub mr-[5px]"></i>Lesson - ${lesson.level_no}</button>

         `
      levelContainer.appendChild(btnDiv)
      }
 }
 loadData() 

//  search button

const searchBtn = document.getElementById('btn-search').addEventListener('click', ()=> {
    removeActive()
   const input = document.getElementById('input-search')
   const searchValue = input.value.toLowerCase()

   fetch('https://openapi.programming-hero.com/api/words/all')
    .then((res) => res.json())
    .then(json => {
        const allWords = json.data
        const fiterWords = allWords.filter(word => 
        word.word.toLowerCase().includes(searchValue)
        )
        displayWord(fiterWords)
    })
  })