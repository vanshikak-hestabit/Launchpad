from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def context_match_score(question: str, answer) -> float:
    
    if isinstance(answer, (tuple, list)):
        answer = str(answer[0])
    else:
        answer = str(answer)

    question = question.lower()
    answer = answer.lower()
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([question, answer])

    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    return round(float(similarity), 2)
