package com.example.tutorial.controller;

import com.example.tutorial.exception.ResourceNotFoundException;
import com.example.tutorial.model.Tutorial;
import com.example.tutorial.model.User;
import com.example.tutorial.repository.TutorialRepository;
import com.example.tutorial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class TutorialController {
    @Autowired
    TutorialRepository tutorialRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/tutorials")
    public ResponseEntity<List<Tutorial>> getAllTutorials(Principal principal) {
        List<Tutorial> tutorials = tutorialRepository.findAllByUserId(principal.getName());
        return new ResponseEntity<>(tutorials, HttpStatus.OK);
    }

    /*@GetMapping("/tutorials/{id}")
    public ResponseEntity<Tutorial> getTutorialById(@PathVariable("id") long id) {
        Tutorial tutorial = tutorialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found Tutorial with id = " + id));

        return new ResponseEntity<>(tutorial, HttpStatus.OK);
    }*/
    @GetMapping("/tutorials/{id}")
    public ResponseEntity<?> getTutorialById(@PathVariable("id") long id, Principal principal) {
        Optional<Tutorial> tutorial = tutorialRepository.findById(id);
        if (!tutorial.isPresent())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else if (tutorial.get().getUser().getId().equals(principal.getName()))
            return new ResponseEntity<>(tutorial.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("/tutorials")
    public ResponseEntity<Tutorial> createTutorial(@Valid @RequestBody Tutorial tutorial,
                                                   @AuthenticationPrincipal OAuth2User principal) throws URISyntaxException {
        Map<String, Object> details = principal.getAttributes();
        String userId = details.get("sub").toString();

        Optional<User> user = userRepository.findById(userId);
        tutorial.setUser(user.orElse(new User(userId, details.get("name").toString(),
                details.get("email").toString())));

        return new ResponseEntity<>(tutorialRepository.save(tutorial), HttpStatus.CREATED);
    }

    @PutMapping("/tutorials/{id}")
    public ResponseEntity<Tutorial> updateTutorial(@PathVariable("id") long id, @RequestBody Tutorial tutorial) {
        Tutorial _tutorial = tutorialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found Tutorial with id = " + id));

        _tutorial.setTitle(tutorial.getTitle());
        _tutorial.setDescription(tutorial.getDescription());
        _tutorial.setPublished(tutorial.isPublished());

        return new ResponseEntity<>(tutorialRepository.save(_tutorial), HttpStatus.OK);
    }

    @DeleteMapping("/tutorials/{id}")
    public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") long id) {
        tutorialRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/tutorials")
    public ResponseEntity<HttpStatus> deleteAllTutorials() {
        tutorialRepository.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/tutorials/published")
    public ResponseEntity<List<Tutorial>> findByPublished() {
        List<Tutorial> tutorials = tutorialRepository.findByPublished(true);

        if (tutorials.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        return new ResponseEntity<>(tutorials, HttpStatus.OK);
    }
}
