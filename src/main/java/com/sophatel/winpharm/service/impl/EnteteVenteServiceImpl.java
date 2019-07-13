package com.sophatel.winpharm.service.impl;

import com.sophatel.winpharm.service.EnteteVenteService;
import com.sophatel.winpharm.service.LigneVenteService;
import com.sophatel.winpharm.domain.EnteteVente;
import com.sophatel.winpharm.domain.LigneVente;
import com.sophatel.winpharm.domain.Produit;
import com.sophatel.winpharm.domain.Stock;
import com.sophatel.winpharm.repository.EnteteVenteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

/**
 * Service Implementation for managing {@link EnteteVente}.
 */
@Service
@Transactional
public class EnteteVenteServiceImpl implements EnteteVenteService {

    private final Logger log = LoggerFactory.getLogger(EnteteVenteServiceImpl.class);

    private final EnteteVenteRepository enteteVenteRepository;
    private final LigneVenteService ligneVenteService;


    public EnteteVenteServiceImpl(EnteteVenteRepository enteteVenteRepository, LigneVenteService ligneVenteService) {
        this.enteteVenteRepository = enteteVenteRepository;
        this.ligneVenteService = ligneVenteService;
    }

    /**
     * Save a enteteVente.
     *
     * @param enteteVente the entity to save.
     * @return the persisted entity.
     */
    @Override
    public EnteteVente save(EnteteVente enteteVente) {
        log.debug("Request to save EnteteVente : {}", enteteVente);
        Set<LigneVente> ligneVentes;
        Produit produit;
        Stock stock;
        double prixHT = 0, prixTTC = 0;
        int stockActuel, qte = 0;
        if (enteteVente.getLigneVentes() != null){
            ligneVentes = enteteVente.getLigneVentes();
            for (LigneVente lv : ligneVentes){
                produit = lv.getProduit();
                stock = produit.getStock();
                stockActuel = stock.stockActuel();
                qte = lv.getLigneVenteQte();
                lv.setLigneVenteDesignation(produit.getProduitLibelle());
                if (stock != null){
                    if (stockActuel == 1){
                        prixHT = stock.getStockPrixHT1();
                        prixTTC = stock.getStockPrix1();
                    } else if (stockActuel == 2){
                        prixHT = stock.getStockPrixHT2();
                        prixTTC = stock.getStockPrix2();
                    } else if (stockActuel == 3){
                        prixHT = stock.getStockPrixHT3();
                        prixTTC = stock.getStockPrix3();
                    }
                    lv.setLigneVentePrixHT(prixHT);
                    lv.setLigneVentePrixTTC(prixTTC);
                    lv.setLigneVenteTotalHT(qte * prixHT);
                    lv.setLigneVenteTotalTTC(qte * prixTTC);
                }
                ligneVenteService.save(lv);
                lv.setEnteteVente(enteteVente);
            }
        }
        enteteVente.calculTotaux();
        return enteteVenteRepository.save(enteteVente);
    }

    /**
     * Get all the enteteVentes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<EnteteVente> findAll(Pageable pageable) {
        log.debug("Request to get all EnteteVentes");
        return enteteVenteRepository.findAll(pageable);
    }

    /**
     * Get all the enteteVentes by date.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<EnteteVente> findAllByDate(String str, Pageable pageable) {
        log.debug("Request to get all EnteteVentes by date");
        return enteteVenteRepository.findAllByDate(str, pageable);
    }

    /**
     * Get one enteteVente by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<EnteteVente> findOne(Long id) {
        log.debug("Request to get EnteteVente : {}", id);
        Optional<EnteteVente> vente = enteteVenteRepository.findById(id);
        Set<LigneVente> ligneVentes = ligneVenteService.findAllByVente(id);
        vente.get().ligneVentes(ligneVentes);
        return vente;
    }

    /**
     * Delete the enteteVente by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EnteteVente : {}", id);
        enteteVenteRepository.deleteById(id);
    }
}
