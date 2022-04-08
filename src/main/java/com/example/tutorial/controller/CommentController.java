package com.example.tutorial.controller;

import com.example.tutorial.exception.ResourceNotFoundException;
import com.example.tutorial.model.Comment;
import com.example.tutorial.repository.CommentRepository;
import com.example.tutorial.repository.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class CommentController {
    @Autowired
    private TutorialRepository tutorialRepository;

    @Autowired
    private CommentRepository commentRepository;

    /*@GetMapping("/tutorials/{tutorialId}/comments")
    public ResponseEntity<List<Comment>> getAllCommentsByTutorialId(@PathVariable(value = "tutorialId") Long tutorialId) {
        if (!tutorialRepository.existsById(tutorialId))
            throw new ResourceNotFoundException("Not found Tutorial with id = " + tutorialId);

        List<Comment> comments = commentRepository.findByTutorialId(tutorialId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }*/

    @GetMapping("/tutorials/{tutorialId}/comments")
    public ResponseEntity<?> getAllCommentsByTutorialId(@PathVariable(value = "tutorialId") Long tutorialId,
                                                        Principal principal) {
        if (!tutorialRepository.existsById(tutorialId))
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        String userId = principal.getName();
        if (tutorialRepository.getById(tutorialId).getUser().getId().equals(userId)) {
            List<Comment> comments = commentRepository.findByTutorialId(tutorialId);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    /*@GetMapping("/comments/{id}")
    public ResponseEntity<Comment> getCommentsById(@PathVariable(value = "id") Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found Tutorial with id = " + id));

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }*/
    @GetMapping("/comments/{id}")
    public ResponseEntity<?> getCommentsById(@PathVariable(value = "id") Long id, Principal principal) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (!comment.isPresent())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else if (comment.get().getTutorial().getUser().getId().equals(principal.getName()))
            return new ResponseEntity<>(comment.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("/tutorials/{tutorialId}/comments")
    public ResponseEntity<Comment> createComment(@PathVariable(value = "tutorialId") Long tutorialId,
                                                 @RequestBody Comment commentRequest) {
        Comment comment = tutorialRepository.findById(tutorialId).map(tutorial -> {
            commentRequest.setTutorial(tutorial);
            return commentRepository.save(commentRequest);
        }).orElseThrow(() -> new ResourceNotFoundException("Not found Tutorial with id = " + tutorialId));

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable("id") long id, @RequestBody Comment commentRequest) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment " + id + " not found"));

        comment.setContent(commentRequest.getContent());

        return new ResponseEntity<>(commentRepository.save(comment), HttpStatus.OK);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<HttpStatus> deleteComment(@PathVariable("id") long id) {
        commentRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/tutorials/{tutorialId}/comments")
    public ResponseEntity<List<Comment>> deleteAllCommentsOfTutorial(@PathVariable(value = "tutorialId") Long tutorialId) {
        if (!tutorialRepository.existsById(tutorialId))
            throw new ResourceNotFoundException("Not found Tutorial with id = " + tutorialId);
        commentRepository.deleteByTutorialId(tutorialId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
