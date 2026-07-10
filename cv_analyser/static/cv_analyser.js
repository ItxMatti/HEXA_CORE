let historyData = [];
let latestAnalysis = {
    reportText: "AI CV Analyser Report",
    jobIdea: "",
    missingSkills: [],
};

// Ensure API points to Flask, not XAMPP!
const FLASK_API_URL = "http://127.0.0.1:5000";

const defaultResumeMarkup = document.getElementById("resumeText").innerHTML;
const defaultJobMarkup = document.getElementById("jobText").innerHTML;

document.getElementById("file").addEventListener("change", function () {
    if (this.files.length > 0) {
        uploadCV();
    }
});

function activateNav(element) {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    if (element) {
        element.classList.add("active");
    }
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function openFileUpload() {
    document.getElementById("file").click();
}

function showScore() {
    scrollToSection("scoreSection");
}

function showSuggestions() {
    scrollToSection("analysisSection");
}

function showJobMatch() {
    scrollToSection("analysisSection");

    if (!latestAnalysis.jobIdea) {
        alert("Upload CV first!");
        return;
    }

    const skillsText = (latestAnalysis.missingSkills && latestAnalysis.missingSkills.length)
        ? "\nMissing skills: " + latestAnalysis.missingSkills.join(", ")
        : "\nMissing skills: None detected";

    alert("Suggested Job Role: " + latestAnalysis.jobIdea + skillsText);
}

function showHistory() {
    if (historyData.length === 0) {
        alert("No history yet!");
        return;
    }

    const historyText = historyData
        .map(
            (item, index) =>
                `#${index + 1} ${item.fileName} | Score: ${item.score} | Match: ${item.match}% | Gap: ${item.skillsGap}`
        )
        .join("\n");

    alert(historyText);
}

function showFeedbackPanel() {
    const tips = document.querySelectorAll("#suggestions li");
    const feedbackText = Array.from(tips)
        .map((tip, index) => `${index + 1}. ${tip.textContent}`)
        .join("\n");

    alert("AI Feedback\n\n" + (feedbackText || "Upload a resume to receive suggestions."));
}

function showSettingsPanel() {
    alert("Settings Panel\n\n- API routing linked to Flask: Active\n- XAMPP CORS enabled: Active");
}

function clearWorkspace() {
    document.getElementById("file").value = "";
    document.getElementById("job_desc").value = "";
    document.getElementById("resumeText").innerHTML = defaultResumeMarkup;
    document.getElementById("jobText").innerHTML = defaultJobMarkup;
    document.getElementById("suggestions").innerHTML = "<li>Upload your CV to start AI analysis.</li><li>Add a job description for better matching.</li>";
    document.getElementById("jobIdeaText").textContent = "Suggested role: Not available yet";
    document.getElementById("boostedHighlights").textContent = "+0 Boosted Highlights";
    latestAnalysis = {
        reportText: "AI CV Analyser Report",
        jobIdea: "",
        missingSkills: [],
    };
    updateDashboard({
        score: 0,
        job_match: 0,
        skills_gap: 0,
        ats: 0,
        content: 0,
        keywords_score: 0,
        formatting: 0,
    });
}

function setRing(id, value, color) {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
    const ring = document.getElementById(id);
    if (ring) {
        ring.style.background = `conic-gradient(${color} ${safeValue}%, #e3e9f4 ${safeValue}%)`;
    }
}

function setWidth(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.style.width = `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
    }
}

function getScoreLabel(score) {
    if (score <= 0) return "Not Analyzed";
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Work";
}

function getMatchLabel(match) {
    if (match <= 0) return "Not Matched";
    if (match >= 80) return "Strong Fit";
    if (match >= 60) return "Match Fit";
    return "Low Match";
}

function updateDashboard(data) {
    document.getElementById("score").textContent = data.score;
    document.getElementById("match").textContent = `${data.job_match}%`;
    document.getElementById("rightMatch").textContent = `${data.job_match}%`;
    document.getElementById("skillsGap").textContent = data.skills_gap;
    document.getElementById("atsValue").textContent = `${data.ats}%`;
    document.getElementById("contentValue").textContent = `${data.content}%`;
    document.getElementById("keywordsValue").textContent = `${data.keywords_score}%`;
    document.getElementById("formattingValue").textContent = `${data.formatting}%`;

    document.getElementById("scoreLabel").textContent = getScoreLabel(data.score);
    document.getElementById("matchLabel").textContent = getMatchLabel(data.job_match);
    document.getElementById("skillsGapLabel").textContent = data.skills_gap === 0 ? "No Missing Skills" : "Missing Skills";

    document.getElementById("scoreCircle").querySelector("span").textContent = data.score;
    document.getElementById("matchCircle").querySelector("span").textContent = `${data.job_match}%`;

    setRing("scoreCircle", data.score, "#3ea45d");
    setRing("matchCircle", data.job_match, "#f5a524");

    setWidth("scoreBar", data.score);
    setWidth("matchBar", data.job_match);
    setWidth("skillsGapBar", Math.min(100, data.skills_gap * 12.5));
    setWidth("atsBar", data.ats);
    setWidth("contentBar", data.content);
    setWidth("keywordsBar", data.keywords_score);
    setWidth("formattingBar", data.formatting);
}

async function uploadCV() {
    const fileInput = document.getElementById("file");
    const jobDesc = document.getElementById("job_desc").value.trim();

    if (!fileInput.files.length) {
        alert("Please upload a resume first!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_desc", jobDesc);

    try {
        // Pointed exactly to Flask
        const response = await fetch(`${FLASK_API_URL}/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.error) {
            alert("Backend Error: " + data.error);
            return;
        }

        latestAnalysis = {
            reportText: data.report_text,
            jobIdea: data.job_idea,
            missingSkills: data.missing_skills || [],
        };

        updateDashboard(data);

        document.getElementById("resumeText").innerHTML = data.resume_html;
        document.getElementById("jobText").innerHTML = data.job_html;
        document.getElementById("jobIdeaText").textContent = `Suggested role: ${data.job_idea}`;
        document.getElementById("boostedHighlights").textContent = `+${data.boosted_highlights} Boosted Highlights`;

        const suggestions = document.getElementById("suggestions");
        suggestions.innerHTML = "";
        data.suggestions.forEach((suggestion) => {
            const li = document.createElement("li");
            li.textContent = suggestion;
            suggestions.appendChild(li);
        });

        historyData.unshift({
            fileName: file.name,
            score: data.score,
            match: data.job_match,
            skillsGap: data.skills_gap,
            createdAt: new Date().toISOString(),
        });

        if (historyData.length > 10) {
            historyData = historyData.slice(0, 10);
        }
    } catch (error) {
        alert("Server connection failed. Is the Python app.py running?");
        console.error("Upload Error:", error);
    }
}

async function downloadReport() {
    try {
        // Pointed exactly to Flask
        const response = await fetch(`${FLASK_API_URL}/download-report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                report_text: latestAnalysis.reportText,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to download report");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cv_analysis_report.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        alert("Unable to download report right now.");
        console.error(error);
    }
}

function exportAnalysisPDF() {
    const title = "AI CV Analyser Report";
    const score = document.getElementById("score").textContent;
    const match = document.getElementById("rightMatch").textContent;
    const jobIdea = document.getElementById("jobIdeaText").textContent;
    const suggestions = Array.from(document.querySelectorAll("#suggestions li"))
        .map((li) => `• ${li.textContent}`)
        .join("\n");

    const reportBody = `${title}\n\nResume Score: ${score}\nJob Match: ${match}\n${jobIdea}\n\nSuggestions:\n${suggestions}\n\n${latestAnalysis.reportText}`;
    const popup = window.open("", "_blank", "width=900,height=700");

    if (!popup) {
        alert("Popup blocked. Please allow popups to export PDF.");
        return;
    }

    popup.document.write(`
        <html>
        <head>
            <title>Export PDF</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #1a2b49; }
                h1 { margin-bottom: 8px; }
                pre { white-space: pre-wrap; line-height: 1.7; font-size: 15px; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <pre>${reportBody.replace(/</g, "<").replace(/>/g, ">")}</pre>
        </body>
        </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
}

clearWorkspace();
