package tno.cigpp_server.model.cigarette;


import lombok.Data;

@Data
public class Tobacco {

    private static final Double GRAMS_PER_CIGARETTE = 0.5;

    private final Long tobaccoId;
    private final String brandName;
    private final  Integer sizeInGrams;
    private final Double price;

    public Double calculatePricePerCigarette() {
        return price / (sizeInGrams / GRAMS_PER_CIGARETTE);
    }
}
