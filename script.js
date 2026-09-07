// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient;

// ============================================
// QUIZ STATE (global for challenge page)
// ============================================
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 300;
let timerInterval = null;
let hasAnswered = false;

// ============================================
// QUIZ QUESTIONS
// ============================================
const quizQuestions = [
    {
        question: "What is the determinant of the matrix [[3, 4], [2, 5]]?",
        options: ["7", "15", "23", "12"],
        correct: 0
    },
    {
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Tree"],
        correct: 1
    },
    {
        question: "What is the derivative of f(x) = 3x² + 2x?",
        options: ["6x + 2", "3x + 2", "6x² + 2", "6x"],
        correct: 0
    },
    {
        question: "Which law states 'For every action, there is an equal and opposite reaction'?",
        options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
        correct: 2
    },
    {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correct: 2
    }
];

// ============================================
// LEARNING CONTENT (hardcoded for prototype)
// ============================================
const learningContent = {
    'Matrices': {
        learn: `A matrix is a rectangular array of numbers, symbols, or expressions, arranged in rows and columns. The size of a matrix is defined by the number of rows and columns it contains.

For example, a 2×3 matrix has 2 rows and 3 columns:

  [a11  a12  a13]
  [a21  a22  a23]

Matrices are used to:
• Solve systems of linear equations
• Represent linear transformations
• Perform computations in engineering and physics
• Store and manipulate data in computer science

Key operations include addition, subtraction, multiplication, and finding determinants and inverses.`,
        notes: `Key Formulas & Points:

1. Matrix Addition: A + B = [aij + bij] (same size required)
2. Matrix Multiplication: (AB)ij = Σ aik × bkj
   • Note: AB ≠ BA (not commutative)
3. Identity Matrix I: diagonal of 1s, rest 0s
4. Transpose Aᵀ: swap rows and columns
5. Determinant (2×2): det([[a,b],[c,d]]) = ad - bc
6. Inverse A⁻¹: exists only if det(A) ≠ 0
   • A⁻¹ = (1/det(A)) × adj(A)
7. Associative: (AB)C = A(BC)
8. Distributive: A(B+C) = AB + AC`
    },
    'Eigenvalues': {
        learn: `Eigenvalues are special scalar values associated with a square matrix. For a square matrix A, an eigenvalue λ is a value for which there exists a non-zero vector v (called an eigenvector) such that:

  Av = λv

This means that when the matrix A acts on the vector v, it only stretches or shrinks it by a factor of λ without changing its direction (unless λ is negative, which reverses the direction).

Eigenvalues have important applications in:
• Stability analysis in differential equations
• Principal component analysis in statistics
• Quantum mechanics
• Vibration analysis in engineering
• Google's PageRank algorithm`,
        notes: `Key Formulas & Points:

1. Characteristic Equation: det(A - λI) = 0
2. Find eigenvectors: solve (A - λI)v = 0 for each λ
3. Trace = Sum of eigenvalues: tr(A) = λ₁ + λ₂ + ... + λₙ
4. Determinant = Product of eigenvalues: det(A) = λ₁ × λ₂ × ... × λₙ
5. A matrix is diagonalizable if it has n linearly independent eigenvectors
6. Symmetric matrices always have real eigenvalues
7. If A has eigenvalue λ, then A⁻¹ has eigenvalue 1/λ
8. If A has eigenvalue λ, then Aᵏ has eigenvalue λᵏ`
    },
    'Calculus': {
        learn: `Calculus is the mathematical study of continuous change, similar to how geometry is the study of shape and algebra is the study of generalizations of arithmetic operations.

It has two major branches:
• Differential Calculus - concerns rates of change and slopes of curves
• Integral Calculus - concerns accumulation of quantities and areas under curves

The fundamental theorem of calculus connects these two branches.

Key concepts:
• Limits: the value a function approaches as the input approaches some value
• Derivatives: measure the instantaneous rate of change
• Integrals: measure the accumulation of quantities
• Series: sums of infinite sequences`,
        notes: `Key Formulas:

1. Power Rule: d/dx(xⁿ) = nxⁿ⁻¹
2. Product Rule: (fg)' = f'g + fg'
3. Quotient Rule: (f/g)' = (f'g - fg') / g²
4. Chain Rule: d/dx f(g(x)) = f'(g(x)) · g'(x)
5. Integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ -1)
6. ∫(1/x) dx = ln|x| + C
7. ∫eˣ dx = eˣ + C
8. Fundamental Theorem: ∫ₐᵇ f(x)dx = F(b) - F(a)`
    },
    'Newton\'s Laws': {
        learn: `Newton's Three Laws of Motion describe the relationship between a body and the forces acting upon it, and the body's motion in response to those forces.

First Law (Law of Inertia):
An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.

Second Law:
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma

Third Law:
For every action, there is an equal and opposite reaction. If object A exerts a force on object B, then object B exerts an equal and opposite force on object A.`,
        notes: `Key Formulas & Points:

1. F = ma (Second Law)
2. F_action = -F_reaction (Third Law)
3. Weight: W = mg (g ≈ 9.8 m/s²)
4. Momentum: p = mv
5. Impulse: J = F·Δt = Δp
6. Friction: f = μN (μ = coefficient of friction)
7. Units: Force in Newtons (N), mass in kg, acceleration in m/s²
8. 1 N = 1 kg·m/s²`
    },
    'Arrays': {
        learn: `An array is a data structure that stores a collection of elements, typically of the same data type, in contiguous memory locations. Each element can be accessed using an index.

Key characteristics:
• Fixed size (in most languages) or dynamic (in some)
• Elements stored in contiguous memory
• Random access via index - O(1)
• Insertion/deletion at end - O(1)
• Insertion/deletion at beginning/middle - O(n)

Common operations:
• Traversal: Visit each element
• Search: Find a specific element
• Insertion: Add an element
• Deletion: Remove an element
• Sorting: Arrange elements in order`,
        notes: `Key Points:

1. Index starts at 0 in most languages (C, Java, Python)
2. Access time: O(1) - direct index access
3. Search (unsorted): O(n) - linear search
4. Search (sorted): O(log n) - binary search
5. Insertion at end: O(1) amortized
6. Insertion at beginning: O(n) - requires shifting
7. Deletion: O(n) for arbitrary position
8. Memory: Contiguous allocation
9. Cache-friendly due to spatial locality`
    },
    'Functions': {
        learn: `A function is a block of organized, reusable code that performs a single, related action. Functions provide better modularity for your application and a high degree of code reusing.

Key concepts:
• Parameters: Input values passed to the function
• Return value: Output produced by the function
• Scope: Visibility of variables (local vs global)
• Recursion: A function that calls itself
• Higher-order functions: Functions that take or return other functions

Types of functions:
• Built-in/library functions
• User-defined functions
• Anonymous/lambda functions
• Recursive functions
• Callback functions`,
        notes: `Key Points:

1. Function declaration: function name(params) { ... }
2. Arrow function: (params) => expression
3. Parameters: passed by value (primitives) or reference (objects)
4. Return: use 'return' keyword; undefined if no return
5. Scope: variables inside function are local
6. Closures: function retains access to its lexical scope
7. Recursion: needs base case to prevent infinite loop
8. Pure function: same input → same output, no side effects
9. Time complexity depends on implementation`
    }
};

// ============================================
// AUTHENTICATION - SHA-256 HASHING
// ============================================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// ============================================
// SESSION MANAGEMENT
// ============================================
function getSession() {
    try {
        return JSON.parse(localStorage.getItem('learnLoopUser'));
    } catch {
        return null;
    }
}

function setSession(user) {
    localStorage.setItem('learnLoopUser', JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem('learnLoopUser');
}

// ============================================
// SIGNUP
// ============================================
async function signup(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }

    try {
        const hashedPassword = await hashPassword(password);

        const { data, error } = await supabaseClient
            .from('users')
            .insert([{ email, password_hash: hashedPassword }])
            .select('id, email')
            .single();

        if (error) {
            if (error.code === '23505') {
                alert('An account with this email already exists. Please login.');
            } else {
                throw error;
            }
            return;
        }

        setSession({ user_id: data.id, email: data.email });
        window.location.href = 'onboarding.html';
    } catch (err) {
        console.error('Signup error:', err);
        alert('Error creating account: ' + err.message);
    }
}

// ============================================
// LOGIN
// ============================================
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }

    try {
        const { data: user, error: userError } = await supabaseClient
            .from('users')
            .select('id, email, password_hash')
            .eq('email', email)
            .maybeSingle();

        if (userError) throw userError;

        if (!user) {
            alert('User not found. Please sign up first.');
            return;
        }

        const hashedPassword = await hashPassword(password);

        if (hashedPassword !== user.password_hash) {
            alert('Incorrect password. Please try again.');
            return;
        }

        setSession({ user_id: user.id, email: user.email });

        // Check if profile exists
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) throw profileError;

        if (profile) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'onboarding.html';
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login error: ' + err.message);
    }
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    clearSession();
    window.location.href = 'login.html';
}

// ============================================
// ONBOARDING
// ============================================
function toggleSelection(btn, group, multi = false) {
    if (!multi) {
        document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
            b.classList.remove('selected');
        });
    }
    btn.classList.toggle('selected');
}

async function saveOnboarding() {
    const session = getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const fullName = document.getElementById('fullName')?.value.trim() || 'Student';
    const yearEl = document.querySelector('[data-group="year"].selected');
    const branchEl = document.querySelector('[data-group="branch"].selected');
    const subjectEls = document.querySelectorAll('[data-group="subjects"].selected');
    const studyTimeEl = document.querySelector('[data-group="study_time"].selected');
    const goalEl = document.querySelector('[data-group="goal"].selected');

    const year = yearEl ? yearEl.dataset.value : null;
    const branch = branchEl ? branchEl.dataset.value : null;
    const subjects = Array.from(subjectEls).map(b => b.dataset.value);
    const studyTime = studyTimeEl ? studyTimeEl.dataset.value : null;
    const goal = goalEl ? goalEl.dataset.value : null;

    if (!year || !branch || subjects.length === 0 || !studyTime || !goal) {
        alert('Please complete all selections before continuing.');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('profiles')
            .upsert({
                id: session.user_id,
                full_name: fullName,
                year,
                branch,
                subjects,
                study_time: studyTime,
                goal,
                streak: 1
            });

        if (error) throw error;

        window.location.href = 'dashboard.html';
    } catch (err) {
        console.error('Onboarding error:', err);
        alert('Error saving profile: ' + err.message);
    }
}

// ============================================
// DASHBOARD
// ============================================
async function loadDashboard() {
    const session = getSession();
    if (!session) return;

    try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user_id)
            .maybeSingle();

        if (profileError) throw profileError;

        if (profile) {
            const name = profile.full_name || 'Student';
            const nameEl = document.getElementById('studentName');
            if (nameEl) nameEl.textContent = name;

            const streakEl = document.getElementById('streakStat');
            if (streakEl) streakEl.textContent = profile.streak || 1;

            // Update profile circle
            const circle = document.getElementById('profileCircle');
            if (circle) circle.textContent = name[0].toUpperCase();
        }

        // Fetch quiz results for accuracy
        const { data: results, error: resultsError } = await supabaseClient
            .from('quiz_results')
            .select('accuracy')
            .eq('user_id', session.user_id);

        if (resultsError) throw resultsError;

        const accuracyEl = document.getElementById('accuracyStat');
        if (accuracyEl) {
            if (results && results.length > 0) {
                const avgAccuracy = Math.round(
                    results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / results.length
                );
                accuracyEl.textContent = `${avgAccuracy}%`;
            } else {
                accuracyEl.textContent = '0%';
            }
        }
    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}

// ============================================
// LEARN PAGE - Popups
// ============================================
function openLearning(topic) {
    const content = learningContent[topic];
    if (!content) return;

    const popup = document.getElementById('learnPopup');
    const title = document.getElementById('popupTitle');
    const body = document.getElementById('popupBody');

    title.textContent = `📖 Learn: ${topic}`;
    body.textContent = content.learn;
    popup.style.display = 'flex';
}

function openNotes(topic) {
    const content = learningContent[topic];
    if (!content) return;

    const popup = document.getElementById('learnPopup');
    const title = document.getElementById('popupTitle');
    const body = document.getElementById('popupBody');

    title.textContent = `📝 Notes: ${topic}`;
    body.textContent = content.notes;
    popup.style.display = 'flex';
}

function closePopup() {
    const popup = document.getElementById('learnPopup');
    if (popup) popup.style.display = 'none';
}

// ============================================
// AI TUTOR
// ============================================
function fillQuestion(question) {
    const textarea = document.getElementById('aiQuestion');
    if (textarea) textarea.value = question;
}

function askLearnLoopAI() {
    const questionEl = document.getElementById('aiQuestion');
    const responseEl = document.getElementById('aiResponse');
    if (!questionEl || !responseEl) return;

    const question = questionEl.value.trim().toLowerCase();
    if (!question) {
        responseEl.innerHTML = '<div class="ai-message">Please type a question first!</div>';
        return;
    }

    let response = '';

    if (question.includes('matrix') || question.includes('matrices')) {
        response = `A matrix is a rectangular arrangement of numbers, symbols, or expressions arranged in rows and columns. The dimensions of a matrix are given as rows × columns. For example, a 2×3 matrix has 2 rows and 3 columns.

Key operations include:
• Addition and subtraction (element-wise, same dimensions)
• Multiplication (columns of A = rows of B)
• Finding the determinant
• Finding the inverse (if det ≠ 0)

The determinant of a 2×2 matrix [[a,b],[c,d]] = ad - bc.`;
    } else if (question.includes('eigenvalue') || question.includes('eigenvector')) {
        response = `An eigenvalue is a special scalar value λ associated with a square matrix A. It satisfies the equation:

    Av = λv

where v is a non-zero vector called an eigenvector. This means when A acts on v, it only scales v by factor λ without changing its direction.

To find eigenvalues, solve the characteristic equation:
    det(A - λI) = 0

Key properties:
• Sum of eigenvalues = trace(A)
• Product of eigenvalues = det(A)`;
    } else if (question.includes('derivative') || question.includes('calculus') || question.includes('differentiat')) {
        response = `A derivative measures the instantaneous rate of change of a function with respect to its variable. Geometrically, it represents the slope of the tangent line at a point.

Key rules:
• Power Rule: d/dx(xⁿ) = n·xⁿ⁻¹
• Product Rule: (fg)' = f'g + fg'
• Quotient Rule: (f/g)' = (f'g - fg')/g²
• Chain Rule: d/dx[f(g(x))] = f'(g(x))·g'(x)

Example: d/dx(3x² + 2x) = 6x + 2`;
    } else if (question.includes('newton') || question.includes('law') || question.includes('motion') || question.includes('force')) {
        response = `Newton's Three Laws of Motion:

1st Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.

2nd Law: Force = mass × acceleration (F = ma)

3rd Law: For every action, there is an equal and opposite reaction.

These laws form the foundation of classical mechanics and describe how objects move under the influence of forces.`;
    } else if (question.includes('array') || question.includes('data structure')) {
        response = `An array is a data structure that stores elements in contiguous memory locations. Each element is accessed by its index (starting from 0 in most languages).

Key properties:
• Random access: O(1) via index
• Insertion at end: O(1) amortized
• Insertion at beginning: O(n) due to shifting
• Search (unsorted): O(n)
• Search (sorted): O(log n) via binary search

Arrays are cache-friendly due to spatial locality but have fixed size in many languages.`;
    } else if (question.includes('function') || question.includes('programming')) {
        response = `A function is a reusable block of code that performs a specific task. Functions help modularize code and avoid repetition.

Key concepts:
• Parameters: inputs passed to the function
• Return value: output produced by the function
• Scope: variables defined inside are local
• Recursion: a function calling itself (needs base case)
• Higher-order functions: take or return other functions

Example (JavaScript):
function add(a, b) { return a + b; }`;
    } else {
        response = `I'm LearnLoop AI! I can help you with topics like:

📐 Mathematics: Matrices, Eigenvalues, Calculus
⚡ Physics: Newton's Laws, Motion, Forces
💻 Programming: Arrays, Functions, Data Structures

Try asking me about any of these topics!`;
    }

    responseEl.innerHTML = `<div class="ai-message">${response}</div>`;
    questionEl.value = '';
}

// ============================================
// CHALLENGE / QUIZ
// ============================================
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 300;
    hasAnswered = false;

    startTimer();
    loadQuestion(0);
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function loadQuestion(index) {
    const q = quizQuestions[index];
    if (!q) return;

    hasAnswered = false;

    const questionEl = document.getElementById('questionText');
    if (questionEl) questionEl.textContent = q.question;

    const container = document.getElementById('optionsContainer');
    if (container) {
        container.innerHTML = '';
        q.options.forEach((option, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => selectAnswer(i, btn);
            container.appendChild(btn);
        });
    }

    // Update progress bar
    const progress = (index / quizQuestions.length) * 100;
    const fillEl = document.getElementById('progressFill');
    if (fillEl) fillEl.style.width = progress + '%';

    // Disable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = true;
}

function selectAnswer(index, btn) {
    if (hasAnswered) return;
    hasAnswered = true;

    const q = quizQuestions[currentQuestionIndex];
    const allOptions = document.querySelectorAll('.option-btn');

    // Disable further clicks
    allOptions.forEach(o => o.style.pointerEvents = 'none');

    // Highlight correct
    if (allOptions[q.correct]) {
        allOptions[q.correct].classList.add('correct');
    }

    // Highlight wrong if user selected wrong
    if (index !== q.correct) {
        btn.classList.add('wrong');
    } else {
        score++;
    }

    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = currentQuestionIndex < quizQuestions.length - 1 ? 'Next →' : 'Finish →';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    if (timerInterval) clearInterval(timerInterval);

    const total = quizQuestions.length;
    const correct = score;
    const wrong = total - correct;
    const accuracy = Math.round((correct / total) * 100);

    // Show result card
    const quizCard = document.getElementById('quizCard');
    const resultCard = document.getElementById('resultCard');
    if (quizCard) quizCard.style.display = 'none';
    if (resultCard) resultCard.style.display = 'block';

    // Update result stats
    const scoreEl = document.getElementById('finalScore');
    const correctEl = document.getElementById('correctCount');
    const wrongEl = document.getElementById('wrongCount');
    const accEl = document.getElementById('accuracyValue');

    if (scoreEl) scoreEl.textContent = `${correct}/${total}`;
    if (correctEl) correctEl.textContent = correct;
    if (wrongEl) wrongEl.textContent = wrong;
    if (accEl) accEl.textContent = `${accuracy}%`;

    // Save to database
    const session = getSession();
    if (!session) return;

    try {
        // Insert quiz result
        const { error: insertError } = await supabaseClient
            .from('quiz_results')
            .insert([{
                user_id: session.user_id,
                score: correct,
                total_questions: total,
                accuracy: accuracy
            }]);

        if (insertError) throw insertError;

        // Fetch current streak
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('streak')
            .eq('id', session.user_id)
            .maybeSingle();

        if (profileError) throw profileError;

        if (profile) {
            const newStreak = (profile.streak || 1) + 1;
            const { error: updateError } = await supabaseClient
                .from('profiles')
                .update({ streak: newStreak })
                .eq('id', session.user_id);

            if (updateError) throw updateError;
        }
    } catch (err) {
        console.error('Error saving quiz results:', err);
    }
}

// ============================================
// PROGRESS PAGE
// ============================================
async function loadProgress() {
    const session = getSession();
    if (!session) return;

    try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user_id)
            .maybeSingle();

        if (profileError) throw profileError;

        // Fetch quiz results
        const { data: results, error: resultsError } = await supabaseClient
            .from('quiz_results')
            .select('*')
            .eq('user_id', session.user_id);

        if (resultsError) throw resultsError;

        const streak = profile?.streak || 1;
        const quizCount = results?.length || 0;
        const avgAccuracy = quizCount > 0
            ? Math.round(results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / quizCount)
            : 0;
        const lessons = 12; // Hardcoded for prototype

        // Update overview stats
        const streakEl = document.getElementById('progressStreak');
        const accuracyEl = document.getElementById('progressAccuracy');
        const lessonsEl = document.getElementById('progressLessons');
        const studyTimeEl = document.getElementById('progressStudyTime');

        if (streakEl) streakEl.textContent = streak;
        if (accuracyEl) accuracyEl.textContent = `${avgAccuracy}%`;
        if (lessonsEl) lessonsEl.textContent = lessons;
        if (studyTimeEl) studyTimeEl.textContent = profile?.study_time || '1hr';

        // Update achievements
        const achievements = document.querySelectorAll('.achievement-card');

        // 7 Day Streak
        if (achievements[0]) {
            if (streak >= 7) {
                achievements[0].classList.remove('locked');
                const status = achievements[0].querySelector('.achievement-status');
                if (status) status.textContent = 'Unlocked!';
            }
        }

        // Quiz Master (accuracy >= 80)
        if (achievements[1]) {
            if (avgAccuracy >= 80) {
                achievements[1].classList.remove('locked');
                const status = achievements[1].querySelector('.achievement-status');
                if (status) status.textContent = 'Unlocked!';
            }
        }

        // First 10 Lessons
        if (achievements[2]) {
            if (lessons >= 10) {
                achievements[2].classList.remove('locked');
                const status = achievements[2].querySelector('.achievement-status');
                if (status) status.textContent = 'Unlocked!';
            }
        }

        // 30 Day Legend
        if (achievements[3]) {
            if (streak >= 30) {
                achievements[3].classList.remove('locked');
                const status = achievements[3].querySelector('.achievement-status');
                if (status) status.textContent = 'Unlocked!';
            }
        }
    } catch (err) {
        console.error('Progress load error:', err);
    }
}

// ============================================
// EXAM PAGE - Revision Popup
// ============================================
function openRevision() {
    const popup = document.getElementById('revisionPopup');
    if (popup) popup.style.display = 'flex';
}

function closeRevisionPopup() {
    const popup = document.getElementById('revisionPopup');
    if (popup) popup.style.display = 'none';
}

function showRevisionTab(tab) {
    document.querySelectorAll('.revision-tab-content').forEach(c => {
        c.style.display = 'none';
    });
    document.querySelectorAll('.revision-tab').forEach(t => {
        t.classList.remove('active');
    });

    const content = document.getElementById('tab-' + tab);
    if (content) content.style.display = 'block';

    const tabBtn = document.querySelector(`[data-tab="${tab}"]`);
    if (tabBtn) tabBtn.classList.add('active');
}

// ============================================
// EXAM PAGE - Subject Selection
// ============================================
function selectExamSubject(btn) {
    document.querySelectorAll('.subject-tab').forEach(t => {
        t.classList.remove('selected');
    });
    btn.classList.add('selected');
}

// ============================================
// PROFILE MENU
// ============================================
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

// Close profile menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('profileMenu');
    const circle = document.getElementById('profileCircle');
    if (menu && circle && !circle.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// ============================================
// UTILITY - Update Profile Circle
// ============================================
function updateProfileCircle() {
    const session = getSession();
    if (!session) return;

    const circle = document.getElementById('profileCircle');
    if (circle && session.email) {
        circle.textContent = session.email[0].toUpperCase();
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase client
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (err) {
        console.error('Failed to initialize Supabase:', err);
    }

    // Determine current page
    const path = window.location.pathname.split('/').pop();
    const currentPage = path === '' ? 'index.html' : path;

    // Protected pages
    const protectedPages = [
        'dashboard.html',
        'learn.html',
        'ai.html',
        'challenge.html',
        'exam.html',
        'progress.html',
        'onboarding.html'
    ];

    // Route guard
    if (protectedPages.includes(currentPage)) {
        const session = getSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }
    }

    // Update profile circle on protected pages
    updateProfileCircle();

    // Page-specific initialization
    try {
        switch (currentPage) {
            case 'dashboard.html':
                await loadDashboard();
                break;
            case 'progress.html':
                await loadProgress();
                break;
            case 'challenge.html':
                startQuiz();
                break;
        }
    } catch (err) {
        console.error('Page initialization error:', err);
    }
});
