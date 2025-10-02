// Intel Event Check-In System
// Beginner-friendly JavaScript code

// Global variables to track attendance
let totalAttendees = 0;
const maxAttendees = 50;
let attendeeList = [];
let teamCounts = {
    water: 0,
    zero: 0,
    power: 0
};

// Get DOM elements
const checkInForm = document.getElementById('checkInForm');
const attendeeNameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const greetingElement = document.getElementById('greeting');
const attendeeCountElement = document.getElementById('attendeeCount');
const progressBar = document.getElementById('progressBar');
const waterCountElement = document.getElementById('waterCount');
const zeroCountElement = document.getElementById('zeroCount');
const powerCountElement = document.getElementById('powerCount');

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    displayGreeting();
    updateAttendanceDisplay();
    updateTeamStats();
    updateAttendeeList();
});

// Display welcome greeting
function displayGreeting() {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    let greeting = '';
    
    if (hour < 12) {
        greeting = 'Good morning! Welcome to the Intel Sustainability Summit.';
    } else if (hour < 18) {
        greeting = 'Good afternoon! Welcome to the Intel Sustainability Summit.';
    } else {
        greeting = 'Good evening! Welcome to the Intel Sustainability Summit.';
    }
    
    greetingElement.textContent = greeting;
}

// Handle form submission
checkInForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const attendeeName = attendeeNameInput.value.trim();
    const selectedTeam = teamSelect.value;
    
    // Validate input
    if (!attendeeName || !selectedTeam) {
        alert('Please enter your name and select a team.');
        return;
    }
    
    // Check if attendee already checked in
    if (isAlreadyCheckedIn(attendeeName)) {
        alert(`${attendeeName} has already checked in!`);
        return;
    }
    
    // Check if event is full
    if (totalAttendees >= maxAttendees) {
        alert('Sorry, the event has reached maximum capacity.');
        return;
    }
    
    // Check if this will be the final attendee (reaching the goal)
    const willReachGoal = (totalAttendees + 1) >= maxAttendees;
    
    // Process check-in
    checkInAttendee(attendeeName, selectedTeam);
});

// Check if attendee is already checked in
function isAlreadyCheckedIn(name) {
    return attendeeList.some(function(attendee) {
        return attendee.name.toLowerCase() === name.toLowerCase();
    });
}

// Process attendee check-in with comprehensive tracking
function checkInAttendee(name, team) {
    // Add attendee to list with detailed information
    const attendee = {
        name: name,
        team: team,
        checkInTime: new Date().toLocaleTimeString(),
        checkInDate: new Date().toLocaleDateString(),
        attendeeNumber: totalAttendees + 1
    };
    
    // Update counts first
    attendeeList.push(attendee);
    totalAttendees++;
    teamCounts[team]++;
    
    // Log check-in for debugging (can be removed in production)
    console.log(`Attendee #${attendee.attendeeNumber}: ${name} checked in to ${team} team at ${attendee.checkInTime}`);
    
    // Update all displays in the correct order
    updateAttendanceDisplay();
    updateTeamStats();
    updateAttendeeList();
    
    // Save to local storage after each check-in
    saveToLocalStorage();
    
    // Check if goal is reached
    const goalReached = totalAttendees >= maxAttendees;
    
    // Check if this is a milestone BEFORE showing success message
    const isMilestone = (totalAttendees === 10 || totalAttendees === 25 || totalAttendees === 40);
    
    if (goalReached) {
        // Show goal celebration with winning team
        celebrateGoalReached(name, team);
    } else if (isMilestone) {
        // Show milestone celebration
        celebrateMilestone(totalAttendees, name, team);
    } else {
        // Show regular success message
        showSuccessMessage(name, team);
    }
    
    // Announce team status if it's the first member or a milestone
    announceTeamStatus(team, teamCounts[team]);
    
    // Clear form for next attendee
    attendeeNameInput.value = '';
    teamSelect.value = '';
    
    // Focus back to name input for efficient continuous check-ins
    attendeeNameInput.focus();
}

// Announce team status updates
function announceTeamStatus(team, count) {
    const teamNames = {
        water: 'Team Water Wise',
        zero: 'Team Net Zero',
        power: 'Team Renewables'
    };
    
    // Announce when a team gets their first member or reaches milestones
    if (count === 1) {
        console.log(`${teamNames[team]} now has their first member!`);
    } else if (count % 5 === 0) {
        console.log(`${teamNames[team]} has reached ${count} members!`);
    }
}

// Show personalized greeting message for each attendee
function showSuccessMessage(name, team) {
    const teamNames = {
        water: 'Team Water Wise',
        zero: 'Team Net Zero',
        power: 'Team Renewables'
    };
    
    const teamEmojis = {
        water: '🌊',
        zero: '🌿', 
        power: '⚡'
    };
    
    const message = `${teamEmojis[team]} Welcome ${name}! You have successfully checked in to ${teamNames[team]}. Thank you for joining our sustainability summit!`;
    greetingElement.textContent = message;
    greetingElement.style.color = '#10b981';
    greetingElement.style.fontWeight = 'bold';
    greetingElement.style.fontSize = '1.1em';
    
    // Reset message after 4 seconds to give time to read
    setTimeout(function() {
        displayGreeting();
        greetingElement.style.color = '';
        greetingElement.style.fontWeight = '';
        greetingElement.style.fontSize = '';
    }, 4000);
}

// Update attendance display and progress bar with enhanced feedback
function updateAttendanceDisplay() {
    // Update the attendance counter
    attendeeCountElement.textContent = totalAttendees;
    
    // Update progress bar with smooth animation
    const progressPercentage = (totalAttendees / maxAttendees) * 100;
    progressBar.style.width = progressPercentage + '%';
    progressBar.style.transition = 'width 0.5s ease-in-out';
    
    // Change progress bar color based on capacity with better thresholds
    if (progressPercentage < 40) {
        progressBar.style.backgroundColor = '#10b981'; // Green - plenty of space
    } else if (progressPercentage < 70) {
        progressBar.style.backgroundColor = '#3b82f6'; // Blue - getting busy
    } else if (progressPercentage < 90) {
        progressBar.style.backgroundColor = '#f59e0b'; // Yellow - almost full
    } else {
        progressBar.style.backgroundColor = '#ef4444'; // Red - nearly at capacity
    }
    
    // Milestone celebrations are now handled in the checkInAttendee function
}

// Update team statistics with enhanced display
function updateTeamStats() {
    waterCountElement.textContent = teamCounts.water;
    zeroCountElement.textContent = teamCounts.zero;
    powerCountElement.textContent = teamCounts.power;
    
    // Highlight the leading team
    const leadingTeam = getLeadingTeam();
    const leadingCount = teamCounts[leadingTeam];
    
    // Reset all team card styles
    document.querySelectorAll('.team-card').forEach(function(card) {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
    });
    
    // Highlight leading team if there are attendees
    if (leadingCount > 0) {
        const leadingCard = document.querySelector(`.team-card.${leadingTeam}`);
        if (leadingCard) {
            leadingCard.style.transform = 'scale(1.02)';
            leadingCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }
    }
}

// Celebrate attendance milestones with proper timing
function celebrateMilestone(count, attendeeName, team) {
    const teamNames = {
        water: 'Team Water Wise',
        zero: 'Team Net Zero',
        power: 'Team Renewables'
    };
    
    const teamEmojis = {
        water: '🌊',
        zero: '🌿', 
        power: '⚡'
    };
    
    // Show milestone celebration first
    const milestoneMessage = `🎉 MILESTONE REACHED! We now have ${count} attendees! 🎉`;
    
    greetingElement.textContent = milestoneMessage;
    greetingElement.style.color = '#8b5cf6';
    greetingElement.style.fontWeight = 'bold';
    greetingElement.style.fontSize = '1.3em';
    greetingElement.style.textAlign = 'center';
    
    // After 3 seconds, show the personal welcome message
    setTimeout(function() {
        const personalMessage = `${teamEmojis[team]} Welcome ${attendeeName}! You helped us reach ${count} attendees for ${teamNames[team]}!`;
        greetingElement.textContent = personalMessage;
        greetingElement.style.color = '#10b981';
        greetingElement.style.fontSize = '1.1em';
        
        // After another 3 seconds, return to default greeting
        setTimeout(function() {
            displayGreeting();
            greetingElement.style.color = '';
            greetingElement.style.fontWeight = '';
            greetingElement.style.fontSize = '';
            greetingElement.style.textAlign = '';
        }, 3000);
    }, 3000);
}

// Celebrate when attendance goal is reached
function celebrateGoalReached(attendeeName, team) {
    const teamNames = {
        water: 'Team Water Wise',
        zero: 'Team Net Zero',
        power: 'Team Renewables'
    };
    
    // Find the winning team (team with most attendees)
    const winningTeam = getLeadingTeam();
    const winningTeamName = teamNames[winningTeam];
    const winningCount = teamCounts[winningTeam];
    
    // Show goal reached celebration
    const goalMessage = `🎉🏆 GOAL REACHED! All ${maxAttendees} spots filled! 🏆🎉`;
    greetingElement.textContent = goalMessage;
    greetingElement.style.color = '#dc2626';
    greetingElement.style.fontWeight = 'bold';
    greetingElement.style.fontSize = '1.4em';
    greetingElement.style.textAlign = 'center';
    
    // After 4 seconds, show winning team message
    setTimeout(function() {
        const winnerMessage = `🏆 Congratulations ${winningTeamName}! You lead with ${winningCount} attendees! 🏆`;
        greetingElement.textContent = winnerMessage;
        greetingElement.style.color = '#059669';
        greetingElement.style.fontSize = '1.2em';
        
        // After another 4 seconds, thank the final attendee
        setTimeout(function() {
            const finalMessage = `Thank you ${attendeeName} for completing our event! Welcome to ${teamNames[team]}!`;
            greetingElement.textContent = finalMessage;
            greetingElement.style.color = '#7c3aed';
            
            // Return to default after 4 more seconds
            setTimeout(function() {
                displayGreeting();
                greetingElement.style.color = '';
                greetingElement.style.fontWeight = '';
                greetingElement.style.fontSize = '';
                greetingElement.style.textAlign = '';
            }, 4000);
        }, 4000);
    }, 4000);
}

// Get team with most attendees
function getLeadingTeam() {
    let leadingTeam = 'water';
    let maxCount = teamCounts.water;
    
    if (teamCounts.zero > maxCount) {
        leadingTeam = 'zero';
        maxCount = teamCounts.zero;
    }
    
    if (teamCounts.power > maxCount) {
        leadingTeam = 'power';
        maxCount = teamCounts.power;
    }
    
    return leadingTeam;
}

// Save data to local storage
function saveToLocalStorage() {
    const data = {
        totalAttendees: totalAttendees,
        teamCounts: teamCounts,
        attendeeList: attendeeList
    };
    localStorage.setItem('intelEventData', JSON.stringify(data));
    console.log('Data saved to local storage:', data);
}

// Load data from local storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('intelEventData');
    if (savedData) {
        const data = JSON.parse(savedData);
        totalAttendees = data.totalAttendees || 0;
        teamCounts = data.teamCounts || { water: 0, zero: 0, power: 0 };
        attendeeList = data.attendeeList || [];
        console.log('Data loaded from local storage:', data);
    }
}

// Clear local storage (useful for testing)
function clearLocalStorage() {
    localStorage.removeItem('intelEventData');
    totalAttendees = 0;
    teamCounts = { water: 0, zero: 0, power: 0 };
    attendeeList = [];
    
    // Update displays if DOM elements exist
    if (attendeeCountElement) updateAttendanceDisplay();
    if (waterCountElement) updateTeamStats();
    updateAttendeeList();
    if (greetingElement) displayGreeting();
    
    console.log('Local storage cleared and data reset');
}

// Optional: Add keyboard shortcut for quick check-in
document.addEventListener('keydown', function(event) {
    // Press Ctrl + Enter to quickly focus on name input
    if (event.ctrlKey && event.key === 'Enter') {
        attendeeNameInput.focus();
    }
});

// Optional: Auto-focus on name input when page loads
window.addEventListener('load', function() {
    attendeeNameInput.focus();
});

// Simple test function to force celebration display
// Type: testCelebration() in the browser console
function testCelebration() {
    console.log('Testing celebration directly...');
    const greetElement = document.getElementById('greeting');
    console.log('Found greeting element:', greetElement);
    
    if (greetElement) {
        greetElement.textContent = '🎉 TEST CELEBRATION MESSAGE! 🎉';
        greetElement.style.color = '#8b5cf6';
        greetElement.style.fontWeight = 'bold';
        greetElement.style.fontSize = '1.5em';
        greetElement.style.textAlign = 'center';
        console.log('Celebration message set successfully!');
    } else {
        console.error('Could not find greeting element!');
    }
}

// Test function - you can call this in the console to quickly test milestones
// Type: testMilestone(10) in the browser console
function testMilestone(targetCount) {
    console.log(`Testing milestone for ${targetCount} attendees`);
    
    // Clear existing data
    totalAttendees = 0;
    attendeeList = [];
    teamCounts = { water: 0, zero: 0, power: 0 };
    
    // Add fake attendees up to the target count
    const teams = ['water', 'zero', 'power'];
    for (let i = 1; i <= targetCount; i++) {
        const team = teams[Math.floor(Math.random() * teams.length)];
        const attendee = {
            name: `Test User ${i}`,
            team: team,
            checkInTime: new Date().toLocaleTimeString(),
            checkInDate: new Date().toLocaleDateString(),
            attendeeNumber: i
        };
        
        attendeeList.push(attendee);
        totalAttendees++;
        teamCounts[team]++;
    }
    
    // Update displays
    updateAttendanceDisplay();
    updateTeamStats();
    updateAttendeeList();
    
    // Test the celebration
    celebrateMilestone(targetCount, `Test User ${targetCount}`, teams[0]);
}

// Update attendee list display
function updateAttendeeList() {
    let attendeeListContainer = document.getElementById('attendeeList');
    
    // Create container if it doesn't exist
    if (!attendeeListContainer) {
        const container = document.querySelector('.container');
        if (!container) {
            console.error('Container not found! Cannot create attendee list.');
            return;
        }
        
        const attendeeSection = document.createElement('div');
        attendeeSection.innerHTML = `
            <div class="attendee-list-section">
                <h3>📋 Attendee List</h3>
                <div id="attendeeList" class="attendee-list">
                    <p class="no-attendees">No attendees yet. Be the first to check in!</p>
                </div>
            </div>
        `;
        container.appendChild(attendeeSection);
        
        // Get the newly created container
        attendeeListContainer = document.getElementById('attendeeList');
    }
    
    if (!attendeeListContainer) {
        console.error('Could not create or find attendee list container!');
        return;
    }
    
    if (attendeeList.length === 0) {
        attendeeListContainer.innerHTML = '<p class="no-attendees">No attendees yet. Be the first to check in!</p>';
        return;
    }
    
    // Create list HTML
    let listHTML = '';
    attendeeList.forEach(function(attendee, index) {
        const teamNames = {
            water: 'Team Water Wise',
            zero: 'Team Net Zero',
            power: 'Team Renewables'
        };
        
        const teamEmojis = {
            water: '🌊',
            zero: '🌿',
            power: '⚡'
        };
        
        listHTML += `
            <div class="attendee-item">
                <span class="attendee-number">#${index + 1}</span>
                <span class="attendee-name">${attendee.name}</span>
                <span class="attendee-team">${teamEmojis[attendee.team]} ${teamNames[attendee.team]}</span>
                <span class="attendee-time">${attendee.checkInTime}</span>
            </div>
        `;
    });
    
    attendeeListContainer.innerHTML = listHTML;
}

// Test goal celebration - call this in console: testGoalCelebration()
function testGoalCelebration() {
    console.log('Testing goal celebration...');
    
    // Clear existing data first
    totalAttendees = 0;
    attendeeList = [];
    teamCounts = { water: 0, zero: 0, power: 0 };
    
    // Add 49 fake attendees
    const teams = ['water', 'zero', 'power'];
    for (let i = 1; i <= 49; i++) {
        const team = teams[Math.floor(Math.random() * teams.length)];
        const attendee = {
            name: `Test User ${i}`,
            team: team,
            checkInTime: new Date().toLocaleTimeString(),
            checkInDate: new Date().toLocaleDateString(),
            attendeeNumber: i
        };
        
        attendeeList.push(attendee);
        totalAttendees++;
        teamCounts[team]++;
    }
    
    // Update displays
    updateAttendanceDisplay();
    updateTeamStats();
    updateAttendeeList();
    
    console.log('Added 49 attendees, now adding final attendee...');
    
    // Add the final (50th) attendee to trigger goal celebration
    setTimeout(function() {
        checkInAttendee('Final Winner', 'water');
    }, 1000);
}