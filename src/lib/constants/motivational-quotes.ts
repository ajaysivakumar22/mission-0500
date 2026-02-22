export const MOTIVATIONAL_QUOTES = [
    {
        text: 'Discipline is doing what you hate to do, but nonetheless doing it like you love it.',
        author: 'Mike Tyson',
    },
    {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
    },
    {
        text: 'Success is the sum of small efforts repeated day in and day out.',
        author: 'Robert Collier',
    },
    {
        text: "Your limitation—it's only your imagination.",
        author: 'Unknown',
    },
    {
        text: 'Great things never came from comfort zones.',
        author: 'Unknown',
    },
    {
        text: 'Dream it. Wish it. Do it.',
        author: 'Unknown',
    },
    {
        text: "Success doesn't just find you. You have to go out and get it.",
        author: 'Unknown',
    },
    {
        text: "The harder you work for something, the greater you'll feel when you achieve it.",
        author: 'Unknown',
    },
    {
        text: 'Dream bigger. Do bigger.',
        author: 'Unknown',
    },
    {
        text: "Don't stop when you're tired. Stop when you're done.",
        author: 'Unknown',
    },
];

export function getRandomQuote() {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export function getQuoteOfTheDay(dateString: string) {
    const date = new Date(dateString);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}
